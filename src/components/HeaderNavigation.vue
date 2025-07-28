<template>
  <div class="header-navigation">
    <!-- 顶部信息栏 -->
    <div class="top-info">
      <div class="top-left">
        <span>总额度剩余: <em>¥{{ remainingTotalBalance.toFixed(2) }}</em></span>
        <span class="divider">|</span>
        <span>ID额度剩余: <em>¥{{ remainingIdBalance.toFixed(2) }}</em></span>
        <span class="divider">|</span>
        <span>订单: <em>{{ orderStatus }}</em></span>
        <span class="divider">|</span>
        <span>我的成绩：<em class="timer-display">{{ formattedTime }}</em></span>
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
              <span>我的订单</span>
            </div>
            <div class="dropdown-item" @click="handleAddressManagement">
              <span>地址管理</span>
            </div>
            <div class="dropdown-item" @click="handleChangePassword">
              <span>修改密码</span>
            </div>
            <div class="dropdown-item" @click="handleLogout">
              <span>退出登录</span>
            </div>
          </div>
        </div>

        <div class="right-section">
          <div class="top-nav">
            <span class="nav-item hot-sale">热卖活动</span>
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
          <router-link to="/home" :class="{ active: currentRoute === '/home' }" @click="setAppNavigation()">首页</router-link>
          <router-link to="/special" :class="{ active: currentRoute === '/special' }" @click="setAppNavigation()">特惠礼包</router-link>


          <router-link to="/european" :class="{ active: currentRoute === '/european' }" @click="setAppNavigation()">欧莱雅国际分销部</router-link>

          <div class="nav-item-with-hover" @mouseenter="showSkinCareLogos = true; cancelSkinCareHide()" @mouseleave="hideSkinCareLogos">
            <router-link to="/skin-care" :class="{ active: currentRoute === '/skin-care' }" @click="setAppNavigation()">皮肤科学美容事业部</router-link>
            <!-- 皮肤科学美容事业部 logo悬停面板 -->
            <div v-if="showSkinCareLogos" class="brand-logos-panel" @mouseenter="cancelSkinCareHide()" @mouseleave="hideSkinCareLogos">
              <div class="brand-logos-content">
                <div class="brand-logo-item" v-for="brand in skinCareBrands" :key="brand.id" @click="goToSkinBrandPage(brand)">
                  <img :src="brand.logo" :alt="brand.name" class="brand-logo-image">
                  <span class="brand-name">{{ brand.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="nav-item-with-hover" @mouseenter="showbeautyLogos = true; cancelbeautyHide()" @mouseleave="hidebeautyLogos">
            <router-link to="/beauty" :class="{ active: currentRoute === '/beauty' }" @click="setAppNavigation()">专业美妆产品</router-link>
            <!-- 专业美妆产品 logo悬停面板 -->
            <div v-if="showbeautyLogos" class="brand-logos-panel" @mouseenter="cancelbeautyHide()" @mouseleave="hidebeautyLogos">
              <div class="brand-logos-content">
                <div class="brand-logo-item" v-for="brand in beautyBrands" :key="brand.id" @click="goTobeautyBrandPage(brand)">
                  <img :src="brand.logo" :alt="brand.name" class="brand-logo-image">
                  <span class="brand-name">{{ brand.name }}</span>
                </div>
              </div>
            </div>
          </div>
          
          
          <div class="nav-item-with-hover" @mouseenter="showAromaCareLogos = true; cancelAromaCareHide()" @mouseleave="hideAromaCareLogos">
            <router-link to="/aromatherapy" :class="{ active: currentRoute === '/aromatherapy' }" @click="setAppNavigation()">高端化妆品部</router-link>
            <!-- 高端化妆品部 logo悬停面板 -->
            <div v-if="showAromaCareLogos" class="brand-logos-panel" @mouseenter="cancelAromaCareHide()" @mouseleave="hideAromaCareLogos">
              <div class="brand-logos-content">
                <div class="brand-logo-item" v-for="brand in aromaCareBrands" :key="brand.id" @click="goToAromaCareBrandPage(brand)">
                  <img :src="brand.logo" :alt="brand.name" class="brand-logo-image">
                  <span class="brand-name">{{ brand.name }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="nav-item-with-hover" @mouseenter="showDermoLogos = true; cancelDermoHide()" @mouseleave="hideDermoLogos">
            <router-link to="/dermo" :class="{ active: currentRoute === '/dermo' }" @click="setAppNavigation()">大众化妆品部</router-link>
            <!-- 大众化妆品部 logo悬停面板 -->
            <div v-if="showDermoLogos" class="brand-logos-panel" @mouseenter="cancelDermoHide()" @mouseleave="hideDermoLogos">
              <div class="brand-logos-content">
                <div class="brand-logo-item" v-for="brand in dermoBrands" :key="brand.id" @click="goToDermoBrandPage(brand)">
                  <img :src="brand.logo" :alt="brand.name" class="brand-logo-image">
                  <span class="brand-name">{{ brand.name }}</span>
                </div>
              </div>
            </div>
          </div>
          

          
        </div>
        <div class="nav-right">
          <div class="search-container">
            <el-input
              placeholder="搜索商品..."
              prefix-icon="Search"
              v-model="searchText"
              @keyup.enter="handleSearch"
              clearable
              class="search-input"
            >
              <template #append>
                <el-button 
                  type="primary" 
                  icon="Search" 
                  @click="handleSearch"
                  class="search-button"
                >
                  搜索
                </el-button>
              </template>
            </el-input>
          </div>
          <div class="cart-icon" @click="goToCart" @mouseenter="cancelCartHide(); showCartHover = true" @mouseleave="hideCartHover">
            <el-badge :value="cartItemCount" class="cart-badge">
              <el-icon><ShoppingCart /></el-icon>
            </el-badge>
            <span>购物车中({{ cartItemCount }})</span>
            
            <!-- 购物车悬停显示层 -->
            <div v-if="showCartHover" class="cart-hover-panel" @mouseenter="cancelCartHide(); showCartHover = true" @mouseleave="hideCartHover">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, ShoppingCart, ArrowDown } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { cartItemCount, cartTotalPrice } from '@/stores/cart.js'
import { remainingTotalBalance, remainingIdBalance, orderStatus, formattedTime } from '@/stores/account.js'
import { setAppNavigation } from '@/router/index.js'

const router = useRouter()
const route = useRoute()
const searchText = ref('')
const showCartHover = ref(false)
const showUserDropdown = ref(false)
const showSkinCareLogos = ref(false)
const showbeautyLogos = ref(false)
const showAromaCareLogos = ref(false)
const showDermoLogos = ref(false)

let hideTimer = null
let cartHideTimer = null
let skinCareHideTimer = null
let beautyHideTimer = null
let aromaCareHideTimer = null
let dermoHideTimer = null

// 当前路由，用于激活状态
const currentRoute = computed(() => {
  const path = route.path
  // 如果是品牌页面，也高亮皮肤科学美容事业部
  if (path.startsWith('/skin-care')) {
    return '/skin-care'
  }
  if (path.startsWith('/beauty')) {
    return '/beauty'
  }
  if (path.startsWith('/aromatherapy')) {
    return '/aromatherapy'
  }
  if (path.startsWith('/dermo')) {
    return '/dermo'
  }
  return path
})

// 皮肤科学美容事业部品牌悬停相关方法
const hideSkinCareLogos = () => {
  skinCareHideTimer = setTimeout(() => {
    showSkinCareLogos.value = false
  }, 50)
}

const cancelSkinCareHide = () => {
  if (skinCareHideTimer) {
    clearTimeout(skinCareHideTimer)
    skinCareHideTimer = null
  }
}

// 专业美妆产品品牌悬停相关方法
const hidebeautyLogos = () => {
  beautyHideTimer = setTimeout(() => {
    showbeautyLogos.value = false
  }, 50)
}

const cancelbeautyHide = () => {
  if (beautyHideTimer) {
    clearTimeout(beautyHideTimer)
    beautyHideTimer = null
  }
}

// 高端化妆品部
const hideAromaCareLogos = () => {
  aromaCareHideTimer = setTimeout(() => {
    showAromaCareLogos.value = false
  }, 50)
}

const cancelAromaCareHide = () => {
  if (aromaCareHideTimer) {
    clearTimeout(aromaCareHideTimer)
    aromaCareHideTimer = null
  }
}

// 大众化妆品部
const hideDermoLogos = () => {
  dermoHideTimer = setTimeout(() => {
    showDermoLogos.value = false
  }, 50)
}
const cancelDermoHide = () => {
  if (dermoHideTimer) {
    clearTimeout(dermoHideTimer)
    dermoHideTimer = null
  }
}


// 跳转到品牌页面
const goToSkinBrandPage = (brand) => {
  showSkinCareLogos.value = false
  setAppNavigation()
  router.push(`/skin-care/${brand.id}`)
}

// 跳转到专业美妆产品品牌页面
const goTobeautyBrandPage = (brand) => {
  showbeautyLogos.value = false
  setAppNavigation()
  router.push(`/beauty/${brand.id}`)
}

// 跳转到高端化妆品部品牌页面
const goToAromaCareBrandPage = (brand) => {
  showAromaCareLogos.value = false
  setAppNavigation()
  router.push(`/aromatherapy/${brand.id}`)
}

// 跳转到大众化妆品部品牌页面
const goToDermoBrandPage = (brand) => {
  showDermoLogos.value = false
  setAppNavigation()
  router.push(`/dermo/${brand.id}`)
}

// 用户下拉框相关方法
const hideDropdown = () => {
  hideTimer = setTimeout(() => {
    showUserDropdown.value = false
  }, 200)
}

const cancelHide = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 购物车悬停相关方法
const hideCartHover = () => {
  cartHideTimer = setTimeout(() => {
    showCartHover.value = false
  }, 200)
}

const cancelCartHide = () => {
  if (cartHideTimer) {
    clearTimeout(cartHideTimer)
    cartHideTimer = null
  }
}

// 用户下拉框处理函数
const handleMyOrders = () => {
  showUserDropdown.value = false
  setAppNavigation()
  router.push('/orders')
}

const handleAddressManagement = () => {
  showUserDropdown.value = false
  setAppNavigation()
  router.push('/address')
}

const handleChangePassword = () => {
  showUserDropdown.value = false
  setAppNavigation()
  router.push('/change-password')
}

const handleLogout = () => {
  showUserDropdown.value = false
  console.log('退出登录')
  window.location.href = '/login'
}

// 搜索功能
const handleSearch = () => {
  if (!searchText.value.trim()) {
    return
  }
  
  setAppNavigation()
  router.push({
    path: '/search',
    query: { 
      keyword: searchText.value.trim(),
      type: 'fuzzy'
    }
  })
}

const goToCart = () => {
  showCartHover.value = false
  setAppNavigation()
  router.push('/cart')
}

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

// 专业美妆产品品牌数据
const beautyBrands = ref([
  {
    id: 'brand1',
    name: '卡诗',
    logo: new URL('@/assets/beauty1.png', import.meta.url).href
  },
  {
    id: 'brand2',
    name: '巴黎欧莱雅沙龙专属',
    logo: new URL('@/assets/beauty2.png', import.meta.url).href
  },
])

// 高端化妆品部品牌数据
const aromaCareBrands = ref([
  {
    id: 'brand1',
    name: '华伦天奴美妆',
    logo: new URL('@/assets/aromatherapy1.png', import.meta.url).href
  },
  {
    id: 'brand2',
    name: '兰蔻',
    logo: new URL('@/assets/aromatherapy2.png', import.meta.url).href
  },
  {
    id: 'brand3',
    name: '植村秀',
    logo: new URL('@/assets/aromatherapy3.png', import.meta.url).href
  },
  {
    id: 'brand4',
    name: '普拉达',
    logo: new URL('@/assets/aromatherapy4.png', import.meta.url).href
  },
  {
    id: 'brand5',
    name: '赫莲娜',
    logo: new URL('@/assets/aromatherapy5.png', import.meta.url).href
  },
  {
    id: 'brand6',
    name: '兰蔻',
    logo: new URL('@/assets/aromatherapy6.png', import.meta.url).href
  },
  {
    id: 'brand7',
    name: '凯芮黛',
    logo: new URL('@/assets/aromatherapy7.png', import.meta.url).href
  },
  {
    id: 'brand8',
    name: '科颜氏',
    logo: new URL('@/assets/aromatherapy8.png', import.meta.url).href
  },
  {
    id: 'brand9',
    name: '碧欧泉',
    logo: new URL('@/assets/aromatherapy9.png', import.meta.url).href
  },
  {
    id: 'brand10',
    name: 'TAKAMI',
    logo: new URL('@/assets/aromatherapy10.png', import.meta.url).href
  },
  {
    id: 'brand11',
    name: '阿玛尼',
    logo: new URL('@/assets/aromatherapy11.png', import.meta.url).href
  },
  {
    id: 'brand12',
    name: 'URBAN DECAY',
    logo: new URL('@/assets/aromatherapy12.png', import.meta.url).href
  },
  {
    id: 'brand13',
    name: '圣罗兰',
    logo: new URL('@/assets/aromatherapy13.png', import.meta.url).href
  }
])

// 大众化妆品部品牌数据
const dermoBrands = ref([
  {
    id: 'brand1',
    name: '美宝莲',
    logo: new URL('@/assets/dermo1.png', import.meta.url).href
  },
  {
    id: 'brand2',
    name: '欧莱雅巴黎',
    logo: new URL('@/assets/dermo2.png', import.meta.url).href
  },
  {
    id: 'brand3',
    name: '三熹玉',
    logo: new URL('@/assets/dermo3.png', import.meta.url).href
  },

])

</script>

<style scoped>
.header-navigation {
  min-width: 1400px;
  width: 100%;
}

.top-info {
  background-color: #fafa0211;
  padding: 12px 0;
  font-size: 12px;
  color: #000000;
  min-width: 1400px;
}

.top-left {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
}

.top-left span {
  margin-right: 20px;
}

.top-left em {
  font-style: normal;
  color: #b69364;
  margin-left: 4px;
}

.timer-display {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #d4593a !important;
  font-size: 13px;
  letter-spacing: 1px;
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
  min-width: 1400px;
}

.content-wrapper {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  position: relative;
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

.nav-item:hover {
  color: #b69364;
}

.nav-item.hot-sale {
  color: #b69364;
  font-weight: bold;
  font-size: 13px;
  position: relative;
}

.main-nav {
  background: black;
  padding: 0;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  min-width: 1400px;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 80px;
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
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #b69364;
}

.nav-links a.active {
  color: #b69364;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #b69364;
}

/* 导航项悬停容器 */
.nav-item-with-hover {
  position: relative;
  display: inline-block;
}

/* 品牌悬停面板样式 */
.brand-logos-panel {
  position: fixed;
  top: 172px;
  left: 180px;
  width: 830px;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 0px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 20px;
  min-height: 200px;
}

.brand-logos-content {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
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

.brand-name {
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

.search-container {
  position: relative;
}

.search-input {
  border-radius: 25px;
}

.search-button {
  background-color: #b69364;
  border-color: #b69364;
  border-radius: 0 25px 25px 0;
  height: 32px;
  width: 80px;
}

.search-button:hover {
  background-color: #a08555;
  border-color: #a08555;
}

:deep(.el-input__wrapper) {
  background-color: #f8f8f8 !important;
  border-radius: 25px 0 0 25px;
  padding: 0 15px;
  border: 2px solid #b69364;
  box-shadow: none;
  width: calc(100% - 60px);
}

:deep(.el-input__inner) {
  font-size: 12px;
  color: #333;
}

:deep(.el-input-group__append) {
  border-radius: 0 25px 25px 0;
  background-color: transparent;
  border: none;
  padding: 0;
  width: 60px;
}

:deep(.el-input__wrapper):hover {
  border-color: #a08555;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #b69364;
  box-shadow: 0 0 0 2px rgba(182, 147, 100, 0.2);
}

:deep(.el-input__prefix) {
  display: none;
}

.nav-right .el-input {
  width: 220px;
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
  right: -70px;
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
</style>
