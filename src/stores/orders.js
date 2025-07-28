import { ref, computed } from 'vue'
import { cancelOrderBalance } from './account.js'
import { batchRestoreStock } from './products.js'

// 订单状态列表
const ORDER_STATUSES = {
  PENDING: '待付款',
  PAID: '待发货', 
  SHIPPED: '已发货',
  DELIVERED: '已发货',
  CANCELLED: '已取消',
  COMPLETED: '已完成'
}

// 订单列表
const orders = ref([])

// 添加新订单
export const addOrder = (orderData) => {
  const shipping = 11.00 // 固定运费
  const newOrder = {
    id: generateOrderId(),
    items: [...orderData.items],
    totalPrice: orderData.totalPrice, // 商品小计
    totalCount: orderData.totalCount,
    shipping: shipping, // 运费
    finalTotal: orderData.totalPrice + shipping, // 最终总计（含运费）
    status: ORDER_STATUSES.PENDING,
    orderTime: new Date(),
    paymentTime: null,
    shippingTime: null,
    deliveryTime: null,
    shippingInfo: {
      recipient: '大圣',
      phone: '132xxxx6',
      address: '广东省 广州市 番禺区 广州市番禺区*******'
    }
  }
  
  orders.value.unshift(newOrder) // 新订单添加到开头
  console.log('New order added:', newOrder)
  return newOrder
}

// 生成订单ID
const generateOrderId = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `${year}${month}${day}${hours}${minutes}${seconds}${random}`
}

// 更新订单状态
export const updateOrderStatus = (orderId, newStatus) => {
  const order = orders.value.find(order => order.id === orderId)
  if (order) {
    order.status = newStatus
    
    // 根据状态更新时间
    const now = new Date()
    if (newStatus === ORDER_STATUSES.PAID) {
      order.paymentTime = now
    } else if (newStatus === ORDER_STATUSES.SHIPPED) {
      order.shippingTime = now
    } else if (newStatus === ORDER_STATUSES.DELIVERED) {
      order.deliveryTime = now
    }
  }
}

// 获取订单列表
export const getOrders = () => orders.value

// 根据状态筛选订单
export const getOrdersByStatus = (status) => {
  if (status === '全部') {
    return orders.value
  }
  return orders.value.filter(order => order.status === status)
}

// 根据ID获取订单
export const getOrderById = (orderId) => {
  return orders.value.find(order => order.id === orderId)
}

// 计算订单统计
export const orderStats = computed(() => {
  const total = orders.value.length
  const pending = orders.value.filter(order => order.status === ORDER_STATUSES.PENDING).length
  const paid = orders.value.filter(order => order.status === ORDER_STATUSES.PAID).length
  const shipped = orders.value.filter(order => order.status === ORDER_STATUSES.SHIPPED).length
  const delivered = orders.value.filter(order => order.status === ORDER_STATUSES.DELIVERED).length
  const cancelled = orders.value.filter(order => order.status === ORDER_STATUSES.CANCELLED).length
  
  return {
    total,
    pending,
    paid,
    shipped,
    delivered,
    cancelled
  }
})

// 模拟支付订单
export const payOrder = (orderId) => {
  updateOrderStatus(orderId, ORDER_STATUSES.PAID)
}

// 取消订单
export const cancelOrder = (orderId) => {
  const order = orders.value.find(order => order.id === orderId)
  if (order && order.status !== ORDER_STATUSES.CANCELLED) {
    // 只有未取消的订单才能取消，并且需要回退余额和恢复库存
    
    // 回退账户余额
    cancelOrderBalance(order.finalTotal) // 回退最终总计金额（包含运费）
    
    // 恢复商品库存
    const stockResult = batchRestoreStock(order.items)
    if (stockResult.success) {
      console.log('库存恢复成功:', stockResult.restorations)
    }
    
    // 更新订单状态为已取消
    updateOrderStatus(orderId, ORDER_STATUSES.CANCELLED)
  }
}

// 导出订单状态常量和订单列表
export { 
  ORDER_STATUSES,
  orders
}
