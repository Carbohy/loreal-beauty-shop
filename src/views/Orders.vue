<template>
  <PageLayout>
    <!-- 主要内容区域 -->
    <div class="orders-main-content">
        
      <!-- 面包屑导航 -->
        <div class="breadcrumb">
        <div class="breadcrumb-content">
            <router-link to="/home" class="breadcrumb-link">首页</router-link>
            <span class="breadcrumb-separator">></span>
            <router-link to="/orders" class="breadcrumb-link">我的账户</router-link>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-current">我的订单</span>
        </div>
        </div>

      <div class="content-layout">
        <!-- 左侧导航菜单 -->
        <div class="sidebar">
          <div class="sidebar-menu">
            <div class="menu-item active">
              <span>我的订单</span>
            </div>
            <div class="menu-item" @click="handleAddressManagement">
              <span>地址管理</span>
            </div>
            <div class="menu-item" @click="handleChangePassword">
              <span>修改密码</span>
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="main-content">
          

          <!-- 订单状态筛选 -->
          <div class="order-filters">
            <div class="filter-tabs">
              <div 
                v-for="status in statusTabs" 
                :key="status.key"
                :class="['filter-tab', { active: currentFilter === status.key }]"
                @click="setFilter(status.key)"
              >
                {{ status.label }}
              </div>
            </div>
          </div>

          <!-- 订单列表 -->
          <div v-if="filteredOrders.length === 0" class="empty-orders">
            <div class="empty-content">
              <div class="empty-text">暂无{{ currentFilter === '全部' ? '' : currentFilter }}订单</div>
              <router-link to="/special" class="continue-shopping">继续购物</router-link>
            </div>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in filteredOrders" :key="order.id" class="order-card">
              <!-- 订单头部 -->
              <div class="order-header">
                <div class="order-info">
                  <span class="order-id">订单编号：{{ order.id }}</span>
                </div>
                <div class="order-status">
                  <span v-if="order.status === '待付款'" class="order-time">支付剩余时间：{{ formatTime(order.orderTime) }}</span>
                  <span v-else class="status-text">{{ order.status }}</span>
                </div>
              </div>

              <!-- 订单商品列表 -->
              <div class="order-products">
                <div v-for="item in order.items" :key="item.id" class="product-item">
                  <div class="product-image">
                    <img :src="item.image" :alt="item.title">
                  </div>
                  <div class="product-details">
                    <div class="product-title">{{ item.title }}</div>
                    <div class="product-spec">{{ item.specificationName }}</div>
                  </div>
                  <div class="product-quantity">{{ item.quantity }}件</div>
                  <div class="product-price">
                    <div class="current-price">¥{{ item.price.toFixed(2) }}</div>
                    <div class="original-price">¥{{ item.originalPrice.toFixed(2) }}</div>
                  </div>
                  <div class="product-status">{{ order.status }}</div>
                </div>
              </div>

              <!-- 订单总计 -->
              <div class="order-total">
                <div class="total-info">
                  <div class="subtotal-line">
                    共{{ order.totalCount }}件商品，小计：<span class="subtotal-amount">¥{{ order.totalPrice.toFixed(2) }}</span>
                  </div>
                  <div class="shipping-line">
                    运费：<span class="shipping-amount">¥{{ (order.shipping || 11.00).toFixed(2) }}</span>
                  </div>
                  <div class="total-line">
                    总计：<span class="total-amount">¥{{ (order.finalTotal || (order.totalPrice + 11.00)).toFixed(2) }}</span>
                  </div>
                </div>
                <div class="order-actions">
                  <button v-if="order.status === '待付款'" class="action-btn primary" @click="payOrder(order.id)">
                    立即支付
                  </button>
                  <button v-if="order.status === '待付款'" class="action-btn" @click="cancelOrder(order.id)">
                    取消订单
                  </button>
                  <button v-if="order.status === '已发货'" class="action-btn" @click="confirmReceipt(order.id)">
                    确认收货
                  </button>
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
import PageLayout from '@/components/PageLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  getOrders, 
  getOrdersByStatus,
  updateOrderStatus,
  ORDER_STATUSES,
  payOrder as payOrderInStore,
  cancelOrder as cancelOrderInStore
} from '@/stores/orders.js'

const router = useRouter()
const currentFilter = ref('全部')

//跳转地址管理页面
const handleAddressManagement = () => {
  router.push('/address')
}

//跳转修改密码页面
const handleChangePassword = () => {
  router.push('/change-password')
}


// 状态筛选标签
const statusTabs = ref([
  { key: '全部', label: '全部' },
  { key: ORDER_STATUSES.PENDING, label: '待付款' },
  { key: ORDER_STATUSES.PAID, label: '待发货' },
  { key: ORDER_STATUSES.SHIPPED, label: '已发货' },
  { key: ORDER_STATUSES.CANCELLED, label: '已取消' }
])

// 获取筛选后的订单
const filteredOrders = computed(() => {
  return getOrdersByStatus(currentFilter.value)
})

// 设置筛选条件
const setFilter = (filter) => {
  currentFilter.value = filter
}

// 格式化时间
const formatTime = (date) => {
  if (!date) return '--'
  const now = new Date()
  const orderTime = new Date(date)
  const diff = Math.floor((now - orderTime) / 1000 / 60) // 分钟差
  
  if (diff < 60) {
    return `${Math.max(0, 120 - diff)}分钟前`
  } else if (diff < 24 * 60) {
    return `${Math.floor(diff / 60)}小时前`
  } else {
    return orderTime.toLocaleDateString()
  }
}

// 支付订单
const payOrder = (orderId) => {
  payOrderInStore(orderId)
  ElMessage.success('支付成功！')
}

// 取消订单
const cancelOrder = (orderId) => {

  cancelOrderInStore(orderId)
  ElMessage.success('订单已取消')
}

// 确认收货
const confirmReceipt = (orderId) => {
  updateOrderStatus(orderId, ORDER_STATUSES.COMPLETED)
  ElMessage.success('确认收货成功！')
}

onMounted(() => {
  console.log('Orders loaded:', getOrders())
})
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

/* 面包屑导航 */
.breadcrumb {
  /* background: white; */
  /* padding: 10px 0; */
  /* border-bottom: 1px solid #eee; */
  /* margin-bottom: 10px; */
  margin-bottom: 20px;
  padding: 10px 0;
  font-size: 12px;
  color: #666;
}

.breadcrumb-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  font-size: 12px;
  color: #666;
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: #b69364;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
}

.breadcrumb-current {
  color: #b69364;
}

/* 主要内容区域 */
.orders-main-content {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}

.content-layout {
  display: flex;
  gap: 20px;
}

/* 左侧导航菜单 */
.sidebar {
  width: 120px;
  flex-shrink: 0;
}

.sidebar-menu {
  background: white;
  border-radius: 0px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
  overflow: hidden;
  
}

.menu-item {
  padding: 15px 20px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  text-align: center;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f8f9fa;
  color: #b69364;
}

.menu-item.active {
  background: #b69364;
  color: white;
  font-weight: 500;
}

/* 右侧内容区域 */
.main-content {
  flex: 1;
}

.orders-header {
  padding: 20px 0;
}

.orders-title {
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: 500;
}

/* 订单筛选 */
.order-filters {
  /* background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1px; */

  /* 距离上边距更近一些 */
  background: white;
  padding: 10px 0;
  font-size: 12px;
  color: #666;
}

.filter-tabs {
  display: flex;
  align-items: center;
  margin-bottom: 0px;
}

.filter-tab {
  padding: 15px 25px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  color: #b69364;
  background: #f8f9fa;
}

.filter-tab.active {
  color: #b69364;
  border-bottom-color: #b69364;
  font-weight: 500;
}

/* 订单列表 */
.empty-orders {
  background: white;
  padding: 80px 20px;
  text-align: center;
  /* border-radius: 8px; */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  /* border-radius: 4px; */
  transition: all 0.3s ease;
}

.continue-shopping:hover {
  background: #d4a574;
  color: white;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  /* border-radius: 8px; */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.order-id {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.order-time {
  font-size: 12px;
  color: #666;
}

.order-status .status-text {
  color: #b69364;
  font-size: 14px;
  font-weight: 500;
}

.order-products {
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  gap: 15px;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  flex-shrink: 0;
}

.product-image img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-details .product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.4;
}

.product-details .product-spec {
  font-size: 12px;
  color: #999;
}

.product-quantity {
  flex-shrink: 0;
  color: #666;
  font-size: 14px;
  width: 60px;
  text-align: center;
}

.product-price {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100px;
}

.product-price .current-price {
  color: #ff6b35;
  font-weight: 600;
  font-size: 14px;
}

.product-price .original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.product-status {
  flex-shrink: 0;
  text-align: center;
  color: #666;
  font-size: 13px;
  width: 80px;
}

.order-total {
  padding: 15px 20px;
  background: #f8f9fa;
  text-align: right;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
  min-width: 90px;
}

.action-btn:hover {
  border-color: #b69364;
  color: #b69364;
}

.action-btn.primary {
  background: #b69364;
  border-color: #b69364;
  color: white;
}

.action-btn.primary:hover {
  background: #a08555;
}

.order-total {
  padding: 15px 20px;
  background: #f8f9fa;
  text-align: right;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.total-info {
  font-size: 14px;
  color: #666;
}

.subtotal-line, .shipping-line {
  margin-bottom: 8px;
}

.total-line {
  padding-top: 8px;
  border-top: 1px solid #ddd;
  font-weight: 500;
}

.subtotal-amount {
  color: #333;
  font-weight: 500;
  margin-left: 8px;
}

.shipping-amount {
  color: #333;
  font-weight: 500;
  margin-left: 8px;
}

.total-amount {
  color: #ff6b35;
  font-weight: 600;
  font-size: 16px;
  margin-left: 8px;
}

@media (max-width: 768px) {
  .orders-main-content {
    margin: 10px;
    padding: 0 10px;
  }
  
  .content-layout {
    flex-direction: column;
    gap: 15px;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar-menu {
    display: flex;
    overflow-x: auto;
  }
  
  .menu-item {
    flex-shrink: 0;
    padding: 10px 15px;
    border-bottom: none;
    border-right: 1px solid #f0f0f0;
  }
  
  .menu-item:last-child {
    border-right: none;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
  }
  
  .filter-tab {
    padding: 10px 15px;
    font-size: 13px;
  }
  
  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    text-align: left;
  }
  
  .product-details {
    width: 100%;
  }
  
  .product-quantity,
  .product-price,
  .product-status {
    width: auto;
    text-align: left;
  }

  .order-total {
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
  }
  
  .order-actions {
    justify-content: center;
    gap: 15px;
  }
}
</style>
