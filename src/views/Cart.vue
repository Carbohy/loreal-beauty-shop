<template>
  <PageLayout>
    <!-- 主要内容区域 -->
    <div class="cart-main-content">
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
            <div class="header-cell checkbox-col">
              <input type="checkbox" v-model="selectAll" @change="handleSelectAll" class="select-checkbox">
            </div>
            <div class="header-cell product-col">商品</div>
            <div class="header-cell price-col">单价</div>
            <div class="header-cell quantity-col">数量</div>
            <div class="header-cell total-col">小计</div>
            <div class="header-cell action-col">操作</div>
          </div>

          <div class="table-body">
            <div v-for="item in cartItems" :key="item.id" class="cart-item-row">
              <div class="item-cell checkbox-cell">
                <input type="checkbox" v-model="item.selected" @change="handleItemSelect" class="select-checkbox">
              </div>
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
                  <button class="quantity-btn" @click="increaseQuantity(item)">+</button>
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
                <input type="checkbox" v-model="selectAll" @change="handleSelectAll" class="select-checkbox">
                <span class="checkmark"></span>
                全选
              </label>
            </div>
            <div class="cart-summary">
              <span class="summary-text">总计：<em class="total-amount">¥{{ selectedTotalPrice.toFixed(2) }}</em></span>
              <span class="savings">不含运费</span>
            </div>
            <div class="checkout-section">
              <button class="checkout-btn" @click="checkout" :disabled="!canCheckout">去结算({{ selectedItemCount }})</button>
              <div v-if="!canCheckout && hasSelectedItems" class="checkout-warning">
                <div v-if="!canCheckoutByOrders">
                  订单数量已达上限 ({{ orderCount }}/{{ maxOrders }})
                </div>
                <div v-if="!canCheckoutByAmount">
                  最低起订金额¥{{ minOrderAmount }}，还需¥{{ (minOrderAmount - selectedTotalPrice).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageLayout from '@/components/PageLayout.vue'
import { 
  cartItems, 
  cartItemCount, 
  cartTotalPrice,
  selectedItemCount,
  selectedTotalPrice,
  hasSelectedItems,
  isAllSelected,
  removeFromCart,
  updateQuantity as updateCartQuantity,
  toggleSelectAll as toggleCartSelectAll,
  clearCart,
  removeSelectedItems,
  createOrder
} from '@/stores/cart.js'
import { 
  remainingTotalBalance, 
  remainingIdBalance, 
  orderStatus, 
  processCheckout,
  orderCount,
  maxOrders,
  minOrderAmount
} from '@/stores/account.js'
import { addOrder } from '@/stores/orders.js'
import { batchReduceStock } from '@/stores/products.js'

const router = useRouter()

const selectAll = computed({
  get: () => isAllSelected.value,
  set: (value) => {
    toggleCartSelectAll(value)
  }
})

// 计算是否可以结算（没有选中商品、订单数量已达上限或金额不足时禁用）
const canCheckout = computed(() => {
  return hasSelectedItems.value && 
         orderCount.value < maxOrders.value && 
         selectedTotalPrice.value >= minOrderAmount.value
})

// 单独检查订单数量限制
const canCheckoutByOrders = computed(() => {
  return orderCount.value < maxOrders.value
})

// 单独检查最低金额限制
const canCheckoutByAmount = computed(() => {
  return selectedTotalPrice.value >= minOrderAmount.value
})

// 增加商品数量
const increaseQuantity = (item) => {
  const result = updateCartQuantity(item.id, item.quantity + 1)
  if (result && !result.success) {
    ElMessage.warning(result.message)
  }
}

// 减少商品数量
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    const result = updateCartQuantity(item.id, item.quantity - 1)
    if (result && !result.success) {
      ElMessage.warning(result.message)
    }
  }
}

// 移除商品
const removeItem = (item) => {
  removeFromCart(item.id)
  ElMessage.success('商品已移除')
}

// 处理单个商品选择
const handleItemSelect = () => {
  // Vue会自动更新item.selected，这里不需要额外处理
}

// 处理全选
const handleSelectAll = () => {
  toggleCartSelectAll(selectAll.value)
}

// 结算
const checkout = () => {
  console.log('checkout clicked')
  console.log('hasSelectedItems:', hasSelectedItems.value)
  console.log('selectedItemCount:', selectedItemCount.value)
  
  if (!hasSelectedItems.value) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  // 计算订单总额和数量
  const orderTotal = selectedTotalPrice.value
  const shipping = 11.00 // 运费
  const finalTotal = orderTotal + shipping // 包含运费的最终总额
  const orderCount = selectedItemCount.value
  
  console.log('订单小计:', orderTotal.toFixed(2))
  console.log('运费:', shipping.toFixed(2))
  console.log('订单总额（含运费）:', finalTotal.toFixed(2))
  console.log('订单数量:', orderCount)
  
  // 检查是否满足结算条件（使用包含运费的总额）
  if (remainingTotalBalance.value < finalTotal) {
    ElMessage.error(`总额度不足！当前剩余：¥${remainingTotalBalance.value.toFixed(2)}，需要：¥${finalTotal.toFixed(2)}（含¥${shipping.toFixed(2)}运费）`)
    return
  }
  
  if (orderCount.value >= maxOrders.value) {
    ElMessage.error(`订单数量已达上限！当前：${orderCount.value}/${maxOrders.value}`)
    return
  }
  
  // 获取选中的商品数据并保存订单（在移除之前）
  const selectedItems = cartItems.value.filter(item => item.selected)
  
  // 检查并扣减库存
  const stockResult = batchReduceStock(selectedItems)
  if (!stockResult.success) {
    ElMessage.error(stockResult.message || '库存不足，无法完成结算')
    return
  }
  
  createOrder(selectedItems, orderTotal, orderCount)
  
  // 添加订单到订单系统
  addOrder({
    items: selectedItems,
    totalPrice: orderTotal, // 商品小计
    totalCount: orderCount
  })
  
  // 处理结算逻辑（使用包含运费的总额）
  const checkoutResult = processCheckout(finalTotal)
  if (!checkoutResult.success) {
    ElMessage.error(checkoutResult.message)
    return
  }
  
  // 移除选中的商品
  removeSelectedItems()
  
  console.log('Navigating to orderConfirm...')
  // 跳转到订单确认页面
  router.push('/orderConfirm').then(() => {
    console.log('Navigation success')
  }).catch((error) => {
    console.error('Navigation error:', error)
  })
}
</script>

<style scoped>
.cart-page {
  width: 1200px;
  margin: 20px auto;
  padding: 0 15px;
}

.cart-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.table-header {
  background: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.select-all-checkbox {
  margin-right: 10px;
}

.table-content {
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  gap: 15px;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-checkbox {
  margin-right: 10px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  margin-left: 15px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.item-specs {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.item-price {
  font-size: 16px;
  color: #e74c3c;
  font-weight: 600;
  margin: 8px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 15px 0;
}

.quantity-button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.quantity-button:hover {
  border-color: #b69364;
  color: #b69364;
}

.quantity-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.quantity-input {
  width: 60px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: 100px;
}

.remove-button {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.remove-button:hover {
  color: #e74c3c;
  background: #ffeaea;
}

.cart-summary {
  /* background: white; */
  color: #999;
  border-radius: 0px;
  box-shadow: 0 2px 2 rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: sticky;
  bottom: 20px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.summary-row.total {
  font-size: 16px;
  font-weight: 600;
  color: #e74c3c;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.checkout-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.checkout-button {
  flex: 1;
  max-width: 200px;
  background: #b69364;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.checkout-button:hover:not(:disabled) {
  background: #a08356;
}

.checkout-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-cart .el-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-cart p {
  font-size: 16px;
  margin-bottom: 24px;
}

.shopping-button {
  background: #b69364;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.shopping-button:hover {
  background: #a08356;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .cart-page {
    width: 100%;
    margin: 20px 10px;
  }
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .item-info {
    margin-left: 0;
    width: 100%;
  }
  
  .item-actions {
    align-items: flex-start;
    width: 100%;
  }
  
  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .checkout-section {
    flex-direction: column;
  }
  
  .checkout-button {
    max-width: none;
    width: 100%;
  }
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

/* 隐藏搜索框前缀图标 */
:deep(.el-input__prefix) {
  display: none;
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

.cart-main-content {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
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
  grid-template-columns: 50px 2fr 1fr 1fr 1fr 1fr;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
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
  grid-template-columns: 50px 2fr 1fr 1fr 1fr 1fr;
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

.checkbox-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #d4a574;
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
  background: #b69364;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 30px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.checkout-btn:hover:not(:disabled) {
  background: #c19660;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.checkout-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.checkout-warning {
  font-size: 12px;
  color: #ff6b35;
  text-align: center;
  padding: 4px 8px;
  background: #fff3f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  white-space: nowrap;
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

  .checkbox-cell {
    order: -1;
    margin-bottom: 10px;
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
}
</style>
