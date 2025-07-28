<template>
  <PageLayout>
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/home" class="breadcrumb-link">首页</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">特惠礼包</span>
        <span class="breadcrumb-separator">></span>
      </div>

      <!-- 分类筛选区 -->
      <div class="filter-section">
        <div class="filter-container">
          <div class="filter-tabs">
            <router-link to="#" class="filter-tab active">综合</router-link>
            <router-link to="#" class="filter-tab">销量</router-link>
            <router-link to="#" class="filter-tab">价格 ↑</router-link>
          </div>

          <div class="category-tags">
            <span 
              class="category-tag" 
              :class="{ selected: selectedCategory === '全部' }"
              @click="filterByCategory('全部')"
            >全部</span>
            <span 
              class="category-tag" 
              :class="{ selected: selectedCategory === '洗护' }"
              @click="filterByCategory('洗护')"
            >洗护</span>
            <span 
              class="category-tag" 
              :class="{ selected: selectedCategory === '护肤' }"
              @click="filterByCategory('护肤')"
            >护肤</span>
            <span 
              class="category-tag" 
              :class="{ selected: selectedCategory === '彩妆' }"
              @click="filterByCategory('彩妆')"
            >彩妆</span>
            <!-- <span 
              class="category-tag" 
              :class="{ selected: selectedCategory === '有货' }"
              @click="filterByCategory('有货')"
            >有货</span>
            <span 
              class="category-tag" 
              :class="{ selected: selectedCategory === '热销' }"
              @click="filterByCategory('热销')"
            >热销</span>
            <span 
              class="category-tag" 
              :class="{ selected: selectedCategory === '限购' }"
              @click="filterByCategory('限购')"
            >限购</span> -->
          </div>
        </div>
      </div>

      <!-- 搜索结果提示 -->
      <div v-if="searchText.trim()" class="search-results-info">
        <span v-if="filteredProducts.length > 0" class="search-info">
          搜索"{{ searchText }}"找到 {{ filteredProducts.length }} 个结果
        </span>
        <span v-else class="no-results">
          未找到"{{ searchText }}"相关商品
        </span>
      </div>

      <!-- 调试信息
      <div class="debug-info" style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <p>总商品数量: {{ products.length }}</p>
        <p>当前选择分类: {{ selectedCategory }}</p>
        <p>过滤后商品数量: {{ filteredProducts.length }}</p>
        <p>商品状态列表: {{ products.map(p => p.statusText).join(', ') }}</p>
      </div> -->

      <!-- 商品列表 -->
      <div class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card" @click="openProductModal(product)">
          <div class="product-image">
            <img :src="product.image" :alt="product.title">
            <span v-if="product.discount" class="discount-tag">{{ product.discount }}</span>
          </div>
          <div class="product-content">
            <div class="product-category">{{ product.category }}</div>
            <h3 class="product-title">{{ product.title }}</h3>
            <div class="price-container">
              <span class="current-price">内购价: ¥{{ product.price }}</span>
              <span class="original-price">市场价: ¥{{ product.originalPrice }}</span>
            </div>
            <span class="stock-status" :class="product.status">{{ product.statusText }}</span>
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
import PageLayout from '@/components/PageLayout.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addToCart } from '@/stores/cart.js'
import { products } from '@/stores/products.js'

const router = useRouter()

// 确保 products 在模板中可用
console.log('Products loaded:', products.value)

const selectedCategory = ref('全部')
const showModal = ref(false)
const selectedProduct = ref({})
const quantity = ref(1)
const selectedSpecIndex = ref(0)

const filterByCategory = (category) => {
  selectedCategory.value = category
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
  selectedSpecIndex.value = 0 // 重置规格选择为第一个
  
  // 保存当前滚动位置
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  // 在下一帧应用位置，确保DOM已更新
  // requestAnimationFrame(() => {
  //   applyModalPosition()  
    // 防止背景页面滚动，但保持滚动位置
  //   document.body.style.overflow = 'hidden'
  //   document.body.style.position = 'fixed'
  //   document.body.style.top = `-${currentScrollTop}px`
  //   document.body.style.width = '100%'
  // })

  requestAnimationFrame(() => {
    applyModalPosition()
    document.body.style.overflow = 'hidden'
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

// 获取当前选中规格的库存
const getSelectedSpecStock = () => {
  if (selectedProduct.value.specifications && selectedProduct.value.specifications[selectedSpecIndex.value]) {
    return selectedProduct.value.specifications[selectedSpecIndex.value].stock || 0
  }
  return 0
}

const addToCartHandler = () => {
  if (!selectedProduct.value.specifications || selectedProduct.value.specifications.length === 0) {
    ElMessage.error('该商品没有可选规格')
    return
  }
  
  const selectedSpec = selectedProduct.value.specifications[selectedSpecIndex.value]
  
  // 检查库存是否充足
  if (selectedSpec.stock < quantity.value) {
    ElMessage.error(`库存不足！`)  //当前库存：${selectedSpec.stock}，请减少数量
    return
  }
  
  addToCart(selectedProduct.value, selectedSpec, quantity.value, selectedSpecIndex.value)
  //ElMessage.success(`已添加 ${quantity.value} 件商品到购物车`)
  
  // 关闭商品详情弹窗
  closeModal()
}

const filteredProducts = computed(() => {
  // 首先过滤出special品牌的产品
  let result = products.value.filter(product => product.brand === 'special')
  
  // 如果有搜索内容，在special品牌产品中搜索
  if (searchText.value.trim()) {
    const keyword = searchText.value.toLowerCase()
    result = result.filter(product => 
      product.title.toLowerCase().includes(keyword) ||
      product.statusText.toLowerCase().includes(keyword)
    )
  }
  
  // 再根据分类筛选
  if (selectedCategory.value !== '全部') {
    result = result.filter(product => product.statusText === selectedCategory.value)
  }
  
  return result
})

// 皮肤科学美容事业部品牌数据
const skinCareBrands = ref([
  {
    id: 'brand1',
    name: '修丽可',
    logo: new URL('@/assets/skin-care1.png', import.meta.url).href
  },
  {
    id: 'brand2', 
    name: '适乐肤',
    logo: new URL('@/assets/skin-care2.png', import.meta.url).href
  },
  {
    id: 'brand3',
    name: '薇姿',
    logo: new URL('@/assets/skin-care3.png', import.meta.url).href
  },
  {
    id: 'brand4',
    name: '理肤泉',
    logo: new URL('@/assets/skin-care4.png', import.meta.url).href
  }
])

// 搜索功能
const searchText = ref('')

const searchResults = computed(() => {
  if (!searchText.value.trim()) {
    return products.value
  }
  
  return products.value.filter(product => 
    product.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.value.toLowerCase())
  )
})
</script>

<style scoped>
.main-content {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 48px;
  min-width: 1000px; /* 保持主要内容区域的最小宽度 */
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

.banner-carousel {
  margin-bottom: 30px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(0, 0, 0, 0.5);
}

:deep(.el-carousel__indicators) {
  bottom: 20px;
}

:deep(.el-carousel__button) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #fff;
}

.product-banner {
  background: white;
  border-radius: 8px;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 30px;
  align-items: center;
  min-height: 400px;
  margin-bottom: 30px;
}

.product-info {
  padding: 20px;
}

.product-logo {
  height: 40px;
  margin-bottom: 20px;
}

.product-info h1 {
  font-size: 32px;
  margin: 20px 0;
  color: #870d2c;
  font-weight: bold;
}

.product-desc {
  font-size: 24px;
  color: #666;
  margin: 15px 0;
}

.promotion-tag {
  display: inline-block;
  background: #fff1e6;
  padding: 8px 20px;
  border-radius: 20px;
  margin-top: 15px;
}

.tag-text {
  color: #b69364;
  font-size: 16px;
}

.product-images {
  position: relative;
  text-align: center;
}

.main-product {
  max-width: 100%;
  height: auto;
}

.discount-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #870d2c;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
}

.promotion-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-box {
  background: #fff1e6;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
}

.highlight {
  color: #870d2c;
  font-weight: bold;
  margin-left: 8px;
}

.filter-section {
  background: white;
  padding: 16px 20px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
}

.filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-tabs {
  display: flex;
  gap: 24px;
}

.filter-tab {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  position: relative;
  padding: 4px 0;
}

.filter-tab.active {
  color: #333;
  font-weight: 500;
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1890ff;
}

.category-tags {
  display: flex;
  gap: 8px;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 2px;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  cursor: pointer;
  border: 1px solid #d9d9d9;
}

.category-tag.selected {
  background: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}

.search-results-info {
  margin: 16px 0;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}

.search-info {
  color: #333;
  font-size: 14px;
}

.no-results {
  color: #666;
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
  padding: 0px 0px 0px 0px;
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
  overflow-y: auto; /* 允许背景滚动 */
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

/* 弹窗动画效果 */
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
}

.product-badge.badge-洗护 {
  background: #d4a574;
}

.product-badge.badge-护肤 {
  background: #d4a574;
}

.product-badge.badge-彩妆 {
  background: #d4a574;
}

.product-badge.badge-男士 {
  background: #d4a574;
}

.product-badge.badge-全部 {
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
