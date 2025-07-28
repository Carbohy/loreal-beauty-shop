<template>
  <PageLayout>
    <!-- 主要内容区域 -->
    <div class="order-confirm-content">
        <!-- 提示条 -->
        <div class="notice-bar">
        <!-- <el-icon class="warning-icon"><InfoFilled /></el-icon> -->
        <span>请注意：内购订单付款后不允许取消订单</span>
        </div>
      <!-- 收货地址 -->
      <div class="address-section">
        <h3 class="section-title">收货地址</h3>
        <div class="address-card">
          <div class="address-info">
            <div class="recipient-info">
              <span class="name">大圣</span>
              <span class="phone">132xxxx6</span>
            </div>
            <div class="address-detail">
              广东省 广州市 番禺区
            </div>
            <div class="address-detail">
              广州市番禺区*******
            </div>
            <div class="address-tags">
              <span class="tag default">默认地址</span>
            </div>
          </div>
          <div class="address-actions">
            <button class="edit-btn">编辑</button>
            <button class="change-btn">更改</button>
          </div>
        </div>
      </div>

      <!-- 商品明细 -->
      <div class="product-section">
        <h3 class="section-title">商品明细</h3>
        <div class="order-products">
          <div class="products-header">
            <span class="store-name">选购商品</span>
          </div>
          
          <!-- 商品表格 -->
          <div class="product-table">
            <div v-for="item in orderItems" :key="item.id" class="product-row">
              <div class="product-image-cell">
                <img :src="item.image" :alt="item.title">
              </div>
              <div class="product-info-cell">
                <div class="product-title">{{ item.title }}</div>
                <div class="product-spec">{{ item.specificationName }}</div>
              </div>
              <div class="product-price-cell">
                <div class="current-price">¥{{ item.price.toFixed(2) }}</div>
                <div class="original-price">¥{{ item.originalPrice.toFixed(2) }}</div>
              </div>
              <div class="product-quantity-cell">
                <span>x{{ item.quantity }}</span>
              </div>
              <div class="product-total-cell">
                <span>¥{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 订单小计行 -->
          <div class="order-subtotal-row">
            <div class="subtotal-left">
              <span class="subtotal-label">小计：</span>
              <span class="subtotal-amount">¥{{ orderSubtotal.toFixed(2) }}</span>
            </div>
            <div class="subtotal-right">
              <span class="shipping-label">运费</span>
              <span class="shipping-amount">¥{{ shipping.toFixed(2) }}</span>
              <el-icon class="shipping-info"><InfoFilled /></el-icon>
            </div>
          </div>
          
          <!-- 合计行 -->
          <div class="order-total-row">
            <div class="total-left">
              <span class="total-label">总计：</span>
              <span class="total-amount">¥{{ orderTotal.toFixed(2) }}</span>
            </div>
            <div class="total-right">
              <span class="payment-time">支付剩余时间：01:59:57</span>
            </div>
          </div>
          
          <!-- 确认按钮 -->
          <div class="confirm-section">
            <button class="confirm-payment-btn" @click="confirmOrder">去支付</button>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import PageLayout from '@/components/PageLayout.vue'
import { 
  cartItems, 
  cartItemCount, 
  cartTotalPrice,
  getOrderData,
  orderData
} from '@/stores/cart.js'
import { 
  remainingTotalBalance, 
  remainingIdBalance, 
  orderStatus, 
  processCheckout 
} from '@/stores/account.js'

const router = useRouter()
const route = useRoute()

// 订单相关数据
const orderItems = ref([])
const shipping = ref(11.00)

// 计算属性
const orderSubtotal = computed(() => {
  return orderItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const orderTotal = computed(() => {
  return orderSubtotal.value + shipping.value
})

// 页面加载时获取订单商品
onMounted(() => {
  // 从订单数据获取商品
  const currentOrderData = getOrderData()
  console.log('Order data:', currentOrderData)
  
  if (!currentOrderData.items || currentOrderData.items.length === 0) {
    ElMessage.warning('没有订单数据')
    router.push('/cart')
    return
  }
  
  orderItems.value = currentOrderData.items
  console.log('Order items loaded:', orderItems.value)
})

// 确认订单
const confirmOrder = () => {
  const totalAmount = orderTotal.value
  const itemCount = orderItems.value.reduce((total, item) => total + item.quantity, 0)
  
  // 模拟支付处理，不调用processCheckout来避免改变余额和订单数量
//   ElMessage.success(`支付成功！订单总额：¥${totalAmount.toFixed(2)}，包含${itemCount}件商品`)
  
  // 清空订单数据
  orderData.value = {
    items: [],
    totalPrice: 0,
    totalCount: 0,
    orderTime: null
  }
  
  // 跳转到订单成功页面或回到首页
  router.push('/orders')
}
</script>

<style scoped>
.notice-bar {
  background-color: #fafa0211;
  border: 0px solid #ffeaa7;
  padding: 12px 20px;
  /* color: #856404; */
  color: black;
  font-size: 13px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  gap: 8px;
  margin-bottom: 10px;
}

.warning-icon {
  color: #f39c12;
  font-size: 16px;
}

.order-confirm-content {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
  display: block;
}

.address-section,
.product-section {
  background: white;
  border-radius: 0px;
  padding: 20px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0 0 15px 0;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.address-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
}

.recipient-info {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
}

.name {
  font-weight: 500;
  color: #333;
}

.phone {
  color: #666;
}

.address-detail {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.address-tags {
  margin-top: 10px;
}

.tag {
  background: #f0f9ff;
  color: #0369a1;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.tag.default {
  background: #d1fae5;
  color: #059669;
}

.address-actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.change-btn {
  background: none;
  border: 1px solid #d4a574;
  color: #d4a574;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.edit-btn:hover,
.change-btn:hover {
  background: #d4a574;
  color: white;
}

.products-header {
  background: #f8f9fa;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.store-name {
  font-weight: 500;
  color: #333;
}

.product-table {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.product-row {
  display: grid;
  grid-template-columns: 100px 3fr 1fr 80px 1fr;
  gap: 15px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: white;
}

.product-row:last-child {
  border-bottom: none;
}

.product-image-cell img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.product-info-cell .product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.4;
}

.product-info-cell .product-spec {
  font-size: 12px;
  color: #999;
}

.product-price-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.product-price-cell .current-price {
  color: #ff6b35;
  font-weight: 600;
  font-size: 14px;
}

.product-price-cell .original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.product-quantity-cell {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.product-total-cell {
  text-align: center;
  color: #ff6b35;
  font-weight: 600;
  font-size: 14px;
}

.order-subtotal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.subtotal-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.subtotal-label {
  color: #666;
  font-size: 14px;
}

.subtotal-amount {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.subtotal-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shipping-label {
  color: #666;
  font-size: 14px;
}

.shipping-amount {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.shipping-info {
  color: #999;
  font-size: 14px;
  cursor: pointer;
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-top: 2px solid #d4a574;
}

.total-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.total-label {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.total-amount {
  color: #ff6b35;
  font-size: 18px;
  font-weight: 700;
}

.total-right .payment-time {
  color: #666;
  font-size: 12px;
}

.confirm-section {
  padding: 20px;
  text-align: right;
  background: #fafafa;
  border-top: 1px solid #e9ecef;
}

.confirm-payment-btn {
  background: #b69364;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-payment-btn:hover {
  background: #c19660;
}

.order-summary {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 90px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.summary-row.total {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-top: 15px;
  font-size: 16px;
  font-weight: 600;
}

.label {
  color: #666;
}

.value {
  color: #333;
}

.total-price {
  color: #ff6b35;
  font-size: 18px;
}

.info-icon {
  margin-left: 5px;
  color: #999;
  cursor: pointer;
  font-size: 14px;
}

.confirm-actions {
  margin-top: 20px;
}

.confirm-btn {
  width: 100%;
  background: #d4a574;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-btn:hover {
  background: #c19660;
}

@media (max-width: 768px) {
  .order-confirm-content {
    margin: 10px;
    padding: 0 10px;
  }
  
  .product-row {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 10px;
  }
  
  .address-card {
    flex-direction: column;
    gap: 15px;
  }
  
  .address-actions {
    align-self: stretch;
  }
}
</style>
