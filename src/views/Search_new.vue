<template>
  <PageLayout>
    <!-- 搜索内容区域 -->
    <div class="search-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/home" class="breadcrumb-link">首页</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">搜索结果</span>
      </div>

      <!-- 搜索信息 -->
      <div class="search-info-section">
        <h2 class="search-title">搜索结果</h2>
        <div v-if="searchKeyword" class="search-keyword">
          搜索关键词：<span class="keyword">{{ searchKeyword }}</span>
        </div>
      </div>

      <!-- 搜索结果统计 -->
      <div class="search-stats">
        <div v-if="searchResults.length > 0" class="stats-info">
          找到 <span class="result-count">{{ searchResults.length }}</span> 个相关商品
        </div>
        <div v-else class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>未找到相关商品</p>
          <p class="suggestions">建议您：</p>
          <ul class="suggestion-list">
            <li>检查输入的关键词是否正确</li>
            <li>尝试使用更简短的关键词</li>
            <li>尝试使用更通用的关键词</li>
          </ul>
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div class="products-grid">
          <div v-for="product in searchResults" :key="product.id" class="product-card" @click="openProductModal(product)">
            <div class="product-image">
              <img :src="product.image" :alt="product.title">
              <span v-if="product.discount" class="discount-tag">{{ product.discount }}</span>
            </div>
            <div class="product-content">
              <div class="product-category">{{ product.category }}</div>
              <h3 class="product-title" v-html="highlightKeyword(product.title)"></h3>
              <div class="price-container">
                <span class="current-price">内购价: ¥{{ product.price }}</span>
                <span class="original-price">市场价: ¥{{ product.originalPrice }}</span>
              </div>
              <span class="stock-status" :class="product.status">{{ product.statusText }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品详情弹窗 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-close" @click="closeModal">×</div>
          
          <div class="modal-body">
            <div class="product-detail-left">
              <img :src="getSelectedSpecImage()" :alt="selectedProduct.title" class="product-detail-image">
            </div>
            
            <div class="product-detail-right">
              <div class="product-badge" :class="`badge-${selectedProduct.statusText}`">{{ selectedProduct.statusText }}</div>
              <h2 class="product-detail-title">{{ selectedProduct.title }}</h2>
              <div class="product-subtitle">大于1年/包装破损</div>
              <div class="product-stock">最低数量限：1</div>
              
              <div class="price-section">
                <span class="detail-current-price">内购价 ¥{{ selectedProduct.specifications && selectedProduct.specifications[selectedSpecIndex] ? selectedProduct.specifications[selectedSpecIndex].price : selectedProduct.price }}</span>
                <span class="detail-original-price">市场价 ¥{{ selectedProduct.specifications && selectedProduct.specifications[selectedSpecIndex] ? selectedProduct.specifications[selectedSpecIndex].originalPrice : selectedProduct.originalPrice }}</span>
              </div>
              
              <div class="specification-section">
                <div class="spec-label">规格</div>
                <div class="spec-options">
                  <button 
                    v-for="(spec, index) in selectedProduct.specifications" 
                    :key="index"
                    class="spec-option" 
                    :class="{ active: selectedSpecIndex === index }"
                    @click="selectSpec(index)"
                  >{{ spec.name }}</button>
                </div>
              </div>
              
              <div class="quantity-section">
                <button class="quantity-btn" @click="decreaseQuantity">-</button>
                <input v-model="quantity" class="quantity-input" type="number" min="1" :max="getSelectedSpecStock()">
                <button class="quantity-btn" @click="increaseQuantity">+</button>
                <span class="stock-limit">库存仅剩{{ getSelectedSpecStock() }}件</span>
              </div>
              
              <button class="add-to-cart-btn" @click="addToCartHandler">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageLayout from '@/components/PageLayout.vue'
import { addToCart } from '@/stores/cart.js'
import { smartSearchProducts } from '@/stores/products.js'

const router = useRouter()
const route = useRoute()

const localSearchText = ref('')
const searchKeyword = ref('')
const searchType = ref('fuzzy') // 默认模糊搜索
const searchResults = ref([])
const showModal = ref(false)
const selectedProduct = ref({})
const quantity = ref(1)
const selectedSpecIndex = ref(0)

// 初始化搜索关键词
onMounted(() => {
  const query = route.query
  if (query.keyword) {
    searchKeyword.value = query.keyword
    localSearchText.value = query.keyword
    searchType.value = query.type || 'fuzzy'
    performSearch(query.keyword)
  }
})

// 监听路由变化
watch(() => route.query, (newQuery) => {
  if (newQuery.keyword) {
    searchKeyword.value = newQuery.keyword
    localSearchText.value = newQuery.keyword
    searchType.value = newQuery.type || 'fuzzy'
    performSearch(newQuery.keyword)
  } else {
    searchKeyword.value = ''
    localSearchText.value = ''
    searchResults.value = []
  }
})

// 监听搜索类型变化，重新搜索
watch(searchType, () => {
  if (searchKeyword.value) {
    performSearch(searchKeyword.value)
  }
})

// 执行搜索
const performSearch = (keyword) => {
  if (!keyword.trim()) {
    searchResults.value = []
    return
  }
  
  // 使用智能搜索函数
  const isExactMatch = searchType.value === 'exact'
  searchResults.value = smartSearchProducts(keyword, isExactMatch)
}

// 处理搜索框输入
const handleSearch = () => {
  if (!localSearchText.value.trim()) {
    return
  }
  
  // 更新URL参数并触发搜索
  router.push({
    path: '/search',
    query: { 
      keyword: localSearchText.value.trim(),
      type: searchType.value
    }
  })
}

// 高亮关键词
const highlightKeyword = (text) => {
  if (!searchKeyword.value) return text
  
  const keyword = searchKeyword.value.trim()
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark class="highlight">$1</mark>')
}

// 动态计算弹窗位置的函数
const calculateModalPosition = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const modalHeight = 600 // 估算的弹窗高度
  const modalWidth = 800 // 弹窗宽度
  
  // 计算弹窗应该显示的顶部位置 - 在当前视口中居中
  const modalTop = scrollTop + Math.max(20, (viewportHeight - modalHeight) / 2)
  const modalLeft = (viewportWidth - modalWidth) / 2
  
  return {
    top: modalTop,
    left: Math.max(20, modalLeft), // 确保不会超出左边界
    transform: 'none' // 不使用transform，直接定位
  }
}

// 应用动态位置的函数
const applyModalPosition = () => {
  const modal = document.querySelector('.modal-content')
  if (modal) {
    const position = calculateModalPosition()
    modal.style.position = 'absolute'
    modal.style.top = position.top + 'px'
    modal.style.left = position.left + 'px'
    modal.style.transform = position.transform
    modal.style.marginTop = '0'
    modal.style.marginLeft = '0'
  }
}

const openProductModal = (product) => {
  selectedProduct.value = product
  showModal.value = true
  quantity.value = 1
  selectedSpecIndex.value = 0
  
  // 保存当前滚动位置
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  // 在下一帧应用位置，确保DOM已更新
  requestAnimationFrame(() => {
    applyModalPosition()
    
    // 防止背景页面滚动，但保持滚动位置
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${currentScrollTop}px`
    document.body.style.width = '100%'
  })
}

const closeModal = () => {
  showModal.value = false
  
  // 恢复页面滚动位置
  const scrollY = document.body.style.top
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = 'auto'
  
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }
}

const selectSpec = (index) => {
  selectedSpecIndex.value = index
  // 切换规格时，重置数量为1，避免超过新规格的库存
  quantity.value = 1
}

// 获取当前选中规格的库存
const getSelectedSpecStock = () => {
  if (selectedProduct.value.specifications && selectedProduct.value.specifications[selectedSpecIndex.value]) {
    return selectedProduct.value.specifications[selectedSpecIndex.value].stock || 0
  }
  return 0
}

const increaseQuantity = () => {
  const currentStock = getSelectedSpecStock()
  if (quantity.value < currentStock) {
    quantity.value++
  } else {
    ElMessage.warning(`库存不足，最多只能选择 ${currentStock} 件`)
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const getSelectedSpecImage = () => {
  if (selectedProduct.value.specifications && selectedProduct.value.specifications[selectedSpecIndex.value]) {
    return selectedProduct.value.specifications[selectedSpecIndex.value].image || selectedProduct.value.image
  }
  return selectedProduct.value.image
}

const addToCartHandler = () => {
  if (!selectedProduct.value.specifications || selectedProduct.value.specifications.length === 0) {
    ElMessage.error('该商品没有可选规格')
    return
  }
  
  const selectedSpec = selectedProduct.value.specifications[selectedSpecIndex.value]
  
  // 检查库存是否充足
  if (selectedSpec.stock < quantity.value) {
    ElMessage.error(`库存不足！`)
    return
  }
  
  addToCart(selectedProduct.value, selectedSpec, quantity.value, selectedSpecIndex.value)
  ElMessage.success(`已添加 ${quantity.value} 件商品到购物车`)
  
  // 关闭商品详情弹窗
  closeModal()
}
</script>

<style scoped>
.search-content {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 48px;
  min-width: 1000px;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 10px 0;
  font-size: 12px;
  color: #666;
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: #1890ff;
}

.breadcrumb-separator {
  margin: 0 5px;
  color: #999;
}

.breadcrumb-current {
  color: #333;
}

.search-info-section {
  margin-bottom: 20px;
}

.search-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}

.search-keyword {
  font-size: 14px;
  color: #666;
}

.keyword {
  color: #1890ff;
  font-weight: 500;
}

.search-stats {
  margin-bottom: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.stats-info {
  font-size: 14px;
  color: #333;
}

.result-count {
  color: #1890ff;
  font-weight: 600;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results p {
  margin: 8px 0;
  font-size: 16px;
}

.suggestions {
  font-weight: 500;
  margin-top: 20px;
}

.suggestion-list {
  text-align: left;
  display: inline-block;
  margin-top: 10px;
}

.suggestion-list li {
  margin: 5px 0;
  font-size: 14px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.product-card {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.2s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  padding-top: 85%;
  background: #f8f8f8;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.discount-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4d4f;
  color: white;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 500;
}

.product-content {
  padding: 12px;
}

.product-category {
  color: #666;
  font-size: 11px;
  margin-bottom: 6px;
  line-height: 1.2;
}

.product-title {
  font-size: 13px;
  color: #333;
  margin: 0 0 8px;
  line-height: 1.3;
  height: 32px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 400;
}

:deep(.highlight) {
  background-color: #fff2e8;
  color: #fa8c16;
  padding: 2px 4px;
  border-radius: 2px;
  font-weight: 500;
}

.price-container {
  margin-bottom: 8px;
}

.current-price {
  display: block;
  color: #ff4d4f;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.original-price {
  color: #999;
  font-size: 11px;
  text-decoration: line-through;
}

.stock-status {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 400;
}

.stock-status.in-stock {
  background: #f6ffed;
  color: #52c41a;
}

.stock-status.hot {
  background: #fff2e8;
  color: #fa8c16;
}

.stock-status.limited {
  background: #f5f5f5;
  color: #999;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 800px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
  position: absolute;
  z-index: 1001;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: modalFadeIn 0.3s ease-out;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  z-index: 1001;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #333;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-body {
  display: flex;
  padding: 70px;
  gap: 30px;
}

.product-detail-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.product-detail-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
}

.product-detail-right {
  flex: 1;
  padding-left: 20px;
}

.product-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  display: inline-block;
  margin-bottom: 15px;
  background: #d4a574;
}

.product-detail-title {
  font-size: 15px;
  color: #333;
  margin: 0 0 10px;
  line-height: 1.4;
  font-weight: 500;
}

.product-subtitle {
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
}

.product-stock {
  color: #666;
  font-size: 12px;
  margin-bottom: 20px;
}

.price-section {
  margin-bottom: 20px;
}

.detail-current-price {
  color: #ff4d4f;
  font-size: 15px;
  font-weight: 600;
  margin-right: 15px;
}

.detail-original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.specification-section {
  margin-bottom: 15px;
}

.spec-label {
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
}

.spec-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-option {
  padding: 10px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
  text-align: left;
  line-height: 1.4;
}

.spec-option:hover {
  border-color: #d4a574;
  color: #d4a574;
}

.spec-option.active {
  border-color: #d4a574;
  color: #d4a574;
  background: #faf6f2;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.quantity-btn:hover {
  border-color: #d4a574;
  color: #d4a574;
}

.quantity-input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 1px solid #d9d9d9;
  font-size: 14px;
}

.stock-limit {
  color: #ff4d4f;
  font-size: 12px;
}

.add-to-cart-btn {
  width: 80%;
  height: 40px;
  background: #d4a574;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 400;
}

.add-to-cart-btn:hover {
  background: #c19660;
}
</style>

<style>
/* 全局样式确保滚动条正常工作 */
html, body {
  overflow-x: auto !important;
  min-width: 1400px !important;
}
</style>
