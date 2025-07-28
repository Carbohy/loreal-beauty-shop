
<template>
  <PageLayout>
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/home" class="breadcrumb-link">首页</router-link>
        <span class="breadcrumb-separator">></span>
        <router-link to="/skin-care" class="breadcrumb-link">皮肤科学美容事业部</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">修丽可</span>
      </div>

      <!-- 分类筛选区 -->
      <div class="filter-section">
        <div class="filter-container">
          <div class="filter-tabs">
            <span class="filter-tab active">综合</span>
            <span class="filter-tab">销量</span>
            <span class="filter-tab">价格 ↑</span>
          </div>

          <div class="category-tags">
            <span 
              v-for="category in availableCategories"
              :key="category"
              class="category-tag" 
              :class="{ selected: selectedCategory === category }"
              @click="filterByCategory(category)"
            >{{ category }}</span>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card" @click="openProductModal(product)">
          <div class="product-image">
            <img :src="product.image" :alt="product.title">
            <!-- <div class="add-to-cart-overlay">
              <span class="add-to-cart-text">抢完就</span>
            </div> -->
          </div>
          <div class="product-content">
            <div class="product-category">{{ product.category }}</div>
            <h3 class="product-title">{{ product.title }}</h3>
            <div class="price-container">
              <span class="current-price">内购价: ¥{{ product.price }}</span>
              <span class="original-price">市场价: ¥{{ product.originalPrice }}</span>
            </div>
            <!-- <span class="stock-status">{{ product.statusText }}</span> -->
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
              <div class="product-badge">{{ selectedProduct.statusText }}</div>
              <h2 class="product-detail-title">{{ selectedProduct.title }}</h2>
              <div class="product-subtitle">大于1年/包装破损</div>
              <div class="product-stock">最低数量限：1</div>
              
              <div class="price-section">
                <span class="detail-current-price">内购价 ¥{{ selectedProduct.specifications && selectedProduct.specifications[selectedSpecIndex] ? selectedProduct.specifications[selectedSpecIndex].price : selectedProduct.price }}</span>
                <span class="detail-original-price">市场价 ¥{{ selectedProduct.specifications && selectedProduct.specifications[selectedSpecIndex] ? selectedProduct.specifications[selectedSpecIndex].originalPrice : selectedProduct.originalPrice }}</span>
              </div>

              <!-- 规格选择 -->
              <div v-if="selectedProduct.specifications && selectedProduct.specifications.length > 0" class="specification-section">
                <div class="spec-label">规格</div>
                <div class="spec-options">
                  <button 
                    v-for="(spec, index) in selectedProduct.specifications" 
                    :key="index"
                    class="spec-option" 
                    :class="{ active: selectedSpecIndex === index }"
                    @click="selectedSpecIndex = index"
                  >{{ spec.name }}</button>
                </div>
              </div>

              <!-- 数量选择 -->
              <div class="quantity-section">
                <button class="quantity-btn" @click="decreaseQuantity">-</button>
                <input v-model="quantity" class="quantity-input" type="number" min="1" :max="getCurrentStock()">
                <button class="quantity-btn" @click="increaseQuantity">+</button>
                <span class="stock-limit">库存仅剩{{ getCurrentStock() }}件</span>
              </div>

              <!-- 操作按钮 -->
              <button class="add-to-cart-btn" @click="addToCartHandler" :disabled="getCurrentStock() <= 0">
                {{ getCurrentStock() <= 0 ? '缺货' : '加入购物车' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { addToCart } from '@/stores/cart.js'
import { products } from '@/stores/products.js'
import PageLayout from '@/components/PageLayout.vue'

const router = useRouter()

const selectedCategory = ref('全部')
const showModal = ref(false)
const selectedProduct = ref({})
const quantity = ref(1)
const selectedSpecIndex = ref(0)

// 获取修丽可品牌的产品
const skinCareProducts = computed(() => {
  return products.value.filter(product => product.brand === 'skinceuticals')
})

const filterByCategory = (category) => {
  selectedCategory.value = category
}

// 获取所有唯一的分类
const availableCategories = computed(() => {
  const categories = ['全部']
  const uniqueStatusTexts = [...new Set(skinCareProducts.value.map(product => product.statusText))]
  return categories.concat(uniqueStatusTexts)
})

// 筛选产品
const filteredProducts = computed(() => {
  if (selectedCategory.value === '全部') {
    return skinCareProducts.value
  }
  return skinCareProducts.value.filter(product => {
    return product.statusText === selectedCategory.value
  })
})

// const getCategoryKeyword = (category) => {
//   const keywordMap = {
//     '精华': '精华',
//     '面霜': '面霜',
//     '洁面': '洁面'
//   }
//   return keywordMap[category] || ''
// }

// 动态计算弹窗位置的函数
const calculateModalPosition = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const modalHeight = 600
  const modalWidth = 800
  
  const modalTop = scrollTop + Math.max(20, (viewportHeight - modalHeight) / 2)
  const modalLeft = (viewportWidth - modalWidth) / 2
  
  return {
    top: modalTop,
    left: Math.max(20, modalLeft),
    transform: 'none'
  }
}

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
  
  requestAnimationFrame(() => {
    applyModalPosition()
    document.body.style.overflow = 'hidden'
  })
}

const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = 'auto'
}

const getSelectedSpecImage = () => {
  if (selectedProduct.value.specifications && selectedProduct.value.specifications[selectedSpecIndex.value]) {
    return selectedProduct.value.specifications[selectedSpecIndex.value].image
  }
  return selectedProduct.value.image
}

const getCurrentStock = () => {
  if (selectedProduct.value.specifications && selectedProduct.value.specifications[selectedSpecIndex.value]) {
    return selectedProduct.value.specifications[selectedSpecIndex.value].stock
  }
  return 0
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (quantity.value < getCurrentStock()) {
    quantity.value++
  }
}

const addToCartHandler = () => {
  if (getCurrentStock() <= 0) {
    ElMessage.warning('商品暂时缺货')
    return
  }

  const currentSpec = selectedProduct.value.specifications && selectedProduct.value.specifications[selectedSpecIndex.value]
  const cartItem = {
    id: selectedProduct.value.id + '-' + selectedSpecIndex.value,
    productId: selectedProduct.value.id,
    title: selectedProduct.value.title,
    specificationName: currentSpec ? currentSpec.name : selectedProduct.value.title,
    selectedSpecIndex: selectedSpecIndex.value,
    price: parseFloat(currentSpec ? currentSpec.price : selectedProduct.value.price),
    originalPrice: parseFloat(currentSpec ? currentSpec.originalPrice : selectedProduct.value.originalPrice),
    quantity: quantity.value,
    image: getSelectedSpecImage(),
    category: selectedProduct.value.category,
    statusText: selectedProduct.value.statusText
  }

  const result = addToCart(cartItem)
  if (result.success) {
    ElMessage.success(result.message)
    closeModal()
  } else {
    ElMessage.error(result.message)
  }
}
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

.add-to-cart-overlay {
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
  /* background: #f6ffed;
  color: #52c41a; */
}

.stock-status.hot {
  background: #fff2e8;
  color: #fa8c16;
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

.specifications {
  margin-bottom: 15px;
}

.specification-section {
  margin-bottom: 15px;
}

.spec-label {
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
}

.specifications h4 {
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

.spec-option.selected,
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

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button,
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

.quantity-controls button:hover,
.quantity-btn:hover {
  border-color: #d4a574;
  color: #d4a574;
}

.quantity-controls input,
.quantity-input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 1px solid #d9d9d9;
  font-size: 14px;
}

.stock-info,
.stock-limit {
  color: #ff4d4f;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.add-cart-btn,
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

.add-cart-btn:hover:not(:disabled),
.add-to-cart-btn:hover:not(:disabled) {
  background: #c19660;
}

.add-cart-btn:disabled,
.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>