<template>
  <div class="home-container">
    <!-- 顶部信息栏 -->
    <div class="top-info">
      <div class="top-left">
        <span>总额度剩余: <em>¥{{ remainingTotalBalance.toFixed(2) }}</em></span>
        <span class="divider">|</span>
        <span>ID额度剩余: <em>¥{{ remainingIdBalance.toFixed(2) }}</em></span>
        <span class="divider">|</span>
        <span>订单: <em>{{ orderStatus }}</em></span>
      </div>
    </div>

    <!-- 次顶部导航 -->
    <div class="sub-header">
      <div class="content-wrapper">
        <div class="logo">
          <img src="@/assets/logo.png" alt="L'OREAL CHINA">
        </div>

        <!-- 用户下拉框 -->
        <div class="user-dropdown" @mouseenter="cancelHide(); showUserDropdown = true" @mouseleave="hideDropdown">
          <div class="user-trigger">
            <span class="username">大圣</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <div v-if="showUserDropdown" class="dropdown-menu" @mouseenter="cancelHide(); showUserDropdown = true" @mouseleave="hideDropdown">
            <div class="dropdown-item" @click="handleMyOrders">
              <!-- <el-icon><List /></el-icon> -->
              <span>我的订单</span>
            </div>
            <div class="dropdown-item" @click="handleAddressManagement">
              <!-- <el-icon><Location /></el-icon> -->
              <span>地址管理</span>
            </div>
            <div class="dropdown-item" @click="handleChangePassword">
              <!-- <el-icon><Lock /></el-icon> -->
              <span>修改密码</span>
            </div>
            <div class="dropdown-item" @click="handleLogout">
              <!-- <el-icon><SwitchButton /></el-icon> -->
              <span>退出登录</span>
            </div>
          </div>
        </div>

        <div class="right-section">
          <div class="top-nav">
            <!-- <span class="nav-item">热卖活动</span> -->
            <span class="nav-item hot-sale" >  热卖活动</span>&ensp;
            <span class="nav-item">帮助中心</span>
            <span class="nav-item">简体中文</span>
            <span class="nav-item">English</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主导航栏 -->
    <div class="main-nav">
      <div class="nav-content">
        <div class="nav-links">
          <router-link to="/home">首页</router-link>
          <router-link to="/special">特惠礼包</router-link>
          <router-link to="/european">欧莱雅国际分销部</router-link>
          <div class="nav-item-with-hover" 
               @mouseenter="showSkinCareLogos = true; cancelSkinCareHide()" 
               @mouseleave="hideSkinCareLogos()">
            <router-link to="/skin-care">皮肤科学美容事业部</router-link>
            <div v-if="showSkinCareLogos" class="brand-logos-panel">
              <div class="brand-logos-content">
                <div v-for="brand in skinCareBrands" :key="brand.id" 
                     class="brand-logo-item" 
                     @click="goToBrandPage(brand.id)">
                  <img :src="brand.logo" :alt="brand.name" />
                  <span>{{ brand.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <router-link to="/beauty">专业美妆产品</router-link>
          <router-link to="/aromatherapy">高端化妆品部</router-link>
          <router-link to="/dermo">大众化妆品部</router-link>
        </div>
        <div class="nav-right">
          <el-input
            placeholder="搜索"
            prefix-icon="Search"
            v-model="searchText"
          />
          <div class="cart-icon" @mouseenter="showCartHover = true" @mouseleave="showCartHover = false">
            <el-badge :value="cartItemCount" class="cart-badge">
              <el-icon><ShoppingCart /></el-icon>
            </el-badge>
            <span>购物车中({{ cartItemCount }})</span>
            
            <!-- 购物车悬停显示层 -->
            <div v-if="showCartHover" class="cart-hover-panel">
              <div class="cart-hover-header">
                <h3>我的购物车</h3>
              </div>
              <div class="cart-hover-content">
                <div class="cart-summary-row">
                  <span class="summary-label">订单金额：</span>
                  <span class="summary-value">¥{{ cartTotalPrice.toFixed(2) }}</span>
                </div>
                <div class="cart-summary-row">
                  <span class="summary-label">商品数量：</span>
                  <span class="summary-value">{{ cartItemCount }}件</span>
                </div>
              </div>
              <div class="cart-hover-footer">
                <button class="goto-cart-btn" @click="goToCart">前往购物车</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="cart-header">
        <h1 class="cart-title">我的购物车({{ cartItemCount }})</h1>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-content">
          <div class="empty-text">购物车是空的</div>
          <router-link to="/special" class="continue-shopping">继续购物</router-link>
        </div>
      </div>

      <div v-else class="cart-content">
        <div class="cart-table">
          <div class="table-header">
            <div class="header-cell product-col">商品</div>
            <div class="header-cell price-col">单价</div>
            <div class="header-cell quantity-col">数量</div>
            <div class="header-cell total-col">小计</div>
            <div class="header-cell action-col">操作</div>
          </div>

          <div class="table-body">
            <div v-for="item in cartItems" :key="item.id" class="cart-item-row">
              <div class="item-cell product-cell">
                <div class="product-info">
                  <img :src="item.image" :alt="item.title" class="product-image">
                  <div class="product-details">
                    <div class="product-title">{{ item.title }}</div>
                    <div class="product-spec">{{ item.specificationName }}</div>
                  </div>
                </div>
              </div>
              <div class="item-cell price-cell">
                <div class="price-content">
                  <span class="current-price">¥{{ item.price.toFixed(2) }}</span>
                  <span class="original-price">¥{{ item.originalPrice.toFixed(2) }}</span>
                </div>
              </div>
              <div class="item-cell quantity-cell">
                <div class="quantity-controls">
                  <button class="quantity-btn" @click="decreaseQuantity(item)">-</button>
                  <span class="quantity-display">{{ item.quantity }}</span>
                  <button class="quantity-btn" @click="increaseQuantity(item)">+</button>1
                </div>
              </div>
              <div class="item-cell total-cell">
                <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
              <div class="item-cell action-cell">
                <button class="remove-btn" @click="removeItem(item)">删除</button>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="footer-content">
            <div class="select-all">
              <label class="checkbox-label">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                <span class="checkmark"></span>
                全选
              </label>
            </div>
            <div class="cart-summary">
              <span class="summary-text">总计：<em class="total-amount">¥{{ cartTotalPrice.toFixed(2) }}</em></span>
              <span class="savings">不含运费</span>
            </div>
            <button class="checkout-btn" @click="checkout">去结算</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, ShoppingCart, User, ArrowDown, List, Location, Lock, SwitchButton } from '@element-plus/icons-vue'
import { 
  cartItems, 
  cartItemCount, 
  cartTotalPrice,
  removeFromCart,
  updateQuantity as updateCartQuantity,
  clearCart,
  createOrder
} from '@/stores/cart.js'
import { 
  remainingTotalBalance, 
  remainingIdBalance, 
  orderStatus, 
  processCheckout,
  orderCount,
  maxOrders
} from '@/stores/account.js'

const router = useRouter()
const searchText = ref('')
const selectAll = ref(false)
const showCartHover = ref(false)

// 品牌悬停功能
const showSkinCareLogos = ref(false)
let skinCareHideTimer = null

// 品牌数据
const skinCareBrands = ref([
  {
    id: 'skinceuticals',
    name: '修丽可',
    logo: new URL('@/assets/skin-care1.png', import.meta.url).href
  },
  {
    id: 'cerave',
    name: '适乐肤',
    logo: new URL('@/assets/skin-care2.png', import.meta.url).href
  },
  {
    id: 'vichy',
    name: '薇姿',
    logo: new URL('@/assets/skin-care3.png', import.meta.url).href
  },
  {
    id: 'laroche',
    name: '理肤泉',
    logo: new URL('@/assets/skin-care4.png', import.meta.url).href
  }
])

// 品牌悬停方法
const hideSkinCareLogos = () => {
  skinCareHideTimer = setTimeout(() => {
    showSkinCareLogos.value = false
  }, 200)
}

const cancelSkinCareHide = () => {
  if (skinCareHideTimer) {
    clearTimeout(skinCareHideTimer)
    skinCareHideTimer = null
  }
}

const goToBrandPage = (brandId) => {
  router.push(`/brand/${brandId}`)
}
const showAccountMenu = ref(false)
const showUserDropdown = ref(false)
let hideTimeout = null

// 延迟隐藏下拉菜单
const hideDropdown = () => {
  hideTimeout = setTimeout(() => {
    showUserDropdown.value = false
  }, 100)
}

// 取消隐藏
const cancelHide = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
}

// 增加商品数量
const increaseQuantity = (item) => {
  updateCartQuantity(item.id, item.quantity + 1)
}

// 减少商品数量
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    updateCartQuantity(item.id, item.quantity - 1)
  }
}

// 移除商品
const removeItem = (item) => {
  removeFromCart(item.id)
  ElMessage.success('商品已移除')
}

// 切换全选状态
const toggleSelectAll = () => {
  // 这里可以添加全选逻辑
  console.log('Toggle select all:', selectAll.value)
}

// 结算
const checkout = () => {
  console.log('checkout clicked in Cart_new')
  console.log('cartItems length:', cartItems.value.length)
  
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车是空的')
    return
  }
  
  // 计算订单总额和数量
  const orderTotal = cartTotalPrice.value
  const orderItemCount = cartItemCount.value
  
  console.log('订单总额:', orderTotal.toFixed(2))
  console.log('订单数量:', orderItemCount)
  
  // 检查是否满足结算条件
  if (remainingTotalBalance.value < orderTotal) {
    ElMessage.error(`总额度不足！当前剩余：¥${remainingTotalBalance.value.toFixed(2)}，需要：¥${orderTotal.toFixed(2)}`)
    return
  }
  
  if (orderCount.value >= maxOrders.value) {
    ElMessage.error(`订单数量已达上限！当前：${orderCount.value}/${maxOrders.value}`)
    return
  }
  
  try {
    console.log('开始处理结算...')
    
    // 保存订单数据（在清空购物车之前）
    createOrder(cartItems.value, orderTotal, orderItemCount)
    console.log('订单数据已保存')
    
    // 处理结算逻辑
    const checkoutResult = processCheckout(orderTotal, orderItemCount)
    console.log('结算处理结果:', checkoutResult)
    
    if (!checkoutResult) {
      ElMessage.error('结算失败，请重试')
      return
    }
    
    // 清除购物车中的商品
    clearCart()
    console.log('购物车已清空')
    
    ElMessage.success('订单已提交，购物车已清空')
    
    console.log('准备跳转到 OrderConfirm 页面...')
    // 跳转到订单确认页面
    router.push('/orderConfirm').then(() => {
      console.log('Navigation success')
    }).catch((error) => {
      console.error('Navigation error:', error)
    })
  } catch (error) {
    console.error('Checkout error:', error)
    ElMessage.error('结算过程中发生错误：' + error.message)
  }
}

// 前往购物车
const goToCart = () => {
  showCartHover.value = false
  router.push('/cart')
}

// 用户下拉框处理函数
const handleMyOrders = () => {
  showUserDropdown.value = false
  router.push('/orders')
}

const handleAddressManagement = () => {
  showUserDropdown.value = false
  router.push('/address')
}

const handleChangePassword = () => {
  showUserDropdown.value = false
  router.push('/change-password')
}

const handleLogout = () => {
  showUserDropdown.value = false
  // 处理退出登录逻辑
  console.log('退出登录')
  // 跳转到登录页面并刷新页面
  window.location.href = '/login'
}
</script>

<style scoped>
/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  min-width: 1400px; /* 防止布局变乱 */
}

.top-info {
  background-color: rgba(250, 250, 2, 0.066);
  padding: 12px 0;
  font-size: 12px;
  color: #000000;
  min-width: 1400px; /* 防止布局变乱 */
}

.top-left {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-left span {
  margin-right: 20px;
}

.top-left em {
  font-style: normal;
  color: #b69364;
  margin-left: 4px;
}

.divider {
  color: #ddd;
  margin: 0 20px;
}

.sub-header {
  height: 70px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  min-width: 1400px; /* 防止布局变乱 */
}

.content-wrapper {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  position: relative;
  min-width: 1200px; /* 防止布局变乱 */
}

/* 用户下拉框样式 */
.user-dropdown {
  position: relative;
  margin-left: 320px;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 16px;
  border: 0px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 13px;
  color: #666;
  transition: all 1.8s ease;
}

.user-trigger:hover {
  border-color: #b69364;
  color: #b69364;
}

.username {
  font-weight: 500;
}

.dropdown-icon {
  font-size: 10px;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 87px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 2px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f5f5f5;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #b69364;
}

.dropdown-item .el-icon {
  font-size: 12px;
}

.right-section {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-right: 200px;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 25px;
  justify-content: flex-end;
}

.nav-item {
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.nav-item.hot-sale {
  color: #b69364;
  font-weight: bold;
  font-size: 13px;
  position: relative;
}

.nav-item:hover {
  color: #b69364;
}

.logo {
  position: absolute;
  left: 200px;
  width: 100px;
}

.logo img {
  height: 50px;
  width: 100%;
}

.main-nav {
  background: black;
  padding: 0;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 80px;
}

.nav-links {
  flex: 1;
  display: flex;
  margin-left: 70px;
  gap: 15px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 13px;
  padding: 4px 8px;
  position: relative;
  font-weight: 500;
}

.nav-links a:hover {
  color: #b69364;
}

/* 品牌悬停面板样式 */
/* .nav-item-with-hover {
  position: relative;
  display: inline-block;
}

.brand-logos-panel {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 20px;
  margin-top: 5px;
}

.brand-logos-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  min-width: 460px;
}

.brand-logo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.brand-logo-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.brand-logo-item img {
  width: 80px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
}

.brand-logo-item span {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: center;
} */

/* 品牌悬停面板样式 */
.nav-item-with-hover {
  position: relative;
  display: inline-block;
}

.brand-logos-panel {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 0px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 20px;
  margin-top: 17px;
}

.brand-logos-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  min-width: 460px;
}

.brand-logo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  /* background: #fafafa; */
}

.brand-logo-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.brand-logo-item img {
  width: 80px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
}

.brand-logo-item span {
  font-size: 11px;
  color: #333;
  font-weight: 500;
  text-align: center;
}


.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: 90px;
}

.nav-right .el-input {
  width: 220px;
}

:deep(.el-input__wrapper) {
  background-color: #f8f8f8 !important;
  border-radius: 15px;
  padding: 0 15px;
}

:deep(.el-input__inner) {
  font-size: 12px;
}

.cart-icon {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #666;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 15px;
  background: #f8f8f8;
  position: relative;
}

.cart-badge :deep(.el-badge__content) {
  background-color: #b69364;
}

/* 购物车悬停面板样式 */
.cart-hover-panel {
  position: absolute;
  top: 100%;
  right: -20px;
  width: 250px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 8px;
}

.cart-hover-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  text-align: center;
}

.cart-hover-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #b69364;
}

.cart-hover-content {
  padding: 15px 20px;
}

.cart-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.cart-summary-row:last-child {
  margin-bottom: 0;
}

.summary-label {
  font-size: 13px;
  color: #666;
}

.summary-value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.cart-hover-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 0 0 8px 8px;
}

.goto-cart-btn {
  width: 100%;
  padding: 8px 16px;
  background: #b69364;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.goto-cart-btn:hover {
  background: #c19660;
}

.cart-main-content {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 2px;
  background: white;
  border-radius: 0px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
}

.cart-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.cart-title {
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: 500;
}

.empty-cart {
  padding: 80px 20px;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.empty-text {
  font-size: 16px;
  color: #999;
}

.continue-shopping {
  color: #d4a574;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #d4a574;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.continue-shopping:hover {
  background: #d4a574;
  color: white;
}

.cart-content {
  padding: 0;
}

.cart-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 0px solid #e9ecef;
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-body {
  background: white;
}

.cart-item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.cart-item-row:last-child {
  border-bottom: none;
}

.item-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-cell {
  padding-right: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.product-details {
  flex: 1;
}

.product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.4;
}

.product-spec {
  font-size: 12px;
  color: #999;
}

.price-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.current-price {
  color: #ff6b35;
  font-weight: 600;
  font-size: 14px;
}

.original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: background-color 0.2s;
}

.quantity-btn:hover {
  background: #f0f0f0;
}

.quantity-btn:first-child {
  border-right: 1px solid #ddd;
}

.quantity-btn:last-child {
  border-left: 1px solid #ddd;
}

.quantity-display {
  width: 50px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: white;
}

.item-total {
  color: #ff6b35;
  font-weight: 600;
  font-size: 14px;
}

.remove-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
}

.remove-btn:hover {
  color: #ff6b35;
}

.cart-footer {
  background: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-all {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.summary-text {
  font-size: 16px;
  color: #333;
}

.total-amount {
  color: #ff6b35;
  font-size: 20px;
  font-weight: 600;
  font-style: normal;
  margin-left: 8px;
}

.savings {
  font-size: 12px;
  color: #999;
}

.checkout-btn {
  background: #d4a574;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 30px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background: #c19660;
}

@media (max-width: 768px) {
  .cart-main-content {
    margin: 10px;
    padding: 0 10px;
  }

  .table-header,
  .cart-item-row {
    grid-template-columns: 1fr;
    gap: 10px;
    text-align: center;
  }

  .product-info {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .footer-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  .main-content {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 48px;
}
}
</style>
