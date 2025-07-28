import { ref, computed } from 'vue'
import { reduceStock, checkStock } from './products.js'

// 购物车状态
const cartItems = ref([])

// 添加商品到购物车
export const addToCart = (productOrCartItem, specification = null, quantity = 1, specIndex = 0) => {
  let cartItem
  
  // 如果传入的是完整的购物车项目对象
  if (productOrCartItem.specificationName && productOrCartItem.price !== undefined) {
    cartItem = {
      id: Date.now() + Math.random(), // 唯一ID
      productId: productOrCartItem.productId,
      title: productOrCartItem.title,
      image: productOrCartItem.image,
      specificationName: productOrCartItem.specificationName,
      selectedSpecIndex: productOrCartItem.selectedSpecIndex || 0,
      price: parseFloat(productOrCartItem.price),
      originalPrice: parseFloat(productOrCartItem.originalPrice),
      quantity: productOrCartItem.quantity || 1,
      category: productOrCartItem.category,
      statusText: productOrCartItem.statusText,
      selected: true // 默认选中
    }
  } else {
    // 兼容旧的调用方式 (product, specification, quantity, specIndex)
    const product = productOrCartItem
    cartItem = {
      id: Date.now() + Math.random(), // 唯一ID
      productId: product.id,
      title: product.title,
      image: specification.image || product.image,
      specificationName: specification.name,
      selectedSpecIndex: specIndex,
      price: parseFloat(specification.price),
      originalPrice: parseFloat(specification.originalPrice),
      quantity: quantity,
      category: product.category,
      statusText: product.statusText,
      selected: true // 默认选中
    }
  }
  
  // 检查库存是否充足
  if (!checkStock(cartItem.productId, cartItem.selectedSpecIndex, cartItem.quantity)) {
    return { success: false, message: '库存不足' }
  }
  
  // 检查是否已存在相同的商品规格
  const existingItem = cartItems.value.find(item => 
    item.productId === cartItem.productId && item.specificationName === cartItem.specificationName
  )
  
  if (existingItem) {
    // 检查增加数量后的库存
    const newQuantity = existingItem.quantity + cartItem.quantity
    if (!checkStock(cartItem.productId, cartItem.selectedSpecIndex, newQuantity)) {
      return { success: false, message: '库存不足' }
    }
    // 不扣减库存，只更新购物车数量
    existingItem.quantity = newQuantity
    return { success: true, message: '商品数量已更新' }
  } else {
    // 不扣减库存，直接添加到购物车
    cartItems.value.push(cartItem)
    return { success: true, message: '商品已添加到购物车' }
  }
}

// 从购物车移除商品
export const removeFromCart = (itemId) => {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

// 更新商品数量
export const updateQuantity = (itemId, newQuantity) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    const quantity = Math.max(1, newQuantity)
    
    // 检查库存是否充足
    if (!checkStock(item.productId, item.selectedSpecIndex, quantity)) {
      return { success: false, message: '库存不足' }
    }
    
    // 只更新数量，不扣减库存
    item.quantity = quantity
    return { success: true, message: '数量已更新' }
  }
  return { success: false, message: '商品不存在' }
}

// 清空购物车
export const clearCart = () => {
  cartItems.value = []
}

// 切换商品选择状态
export const toggleItemSelection = (itemId) => {
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    item.selected = !item.selected
  }
}

// 切换全选状态
export const toggleSelectAll = (selectAll) => {
  cartItems.value.forEach(item => {
    item.selected = selectAll
  })
}

// 检查是否全选
export const isAllSelected = computed(() => {
  if (cartItems.value.length === 0) return false
  return cartItems.value.every(item => item.selected)
})

// 检查是否有选中的商品
export const hasSelectedItems = computed(() => {
  return cartItems.value.some(item => item.selected)
})

// 计算购物车商品种类数量
export const cartItemCount = computed(() => {
  return cartItems.value.length
})

// 计算选中商品的种类数量
export const selectedItemCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length
})

// 计算购物车商品总数量（所有商品数量的合计）
export const cartTotalQuantity = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// 计算选中商品的总数量（所有选中商品数量的合计）
export const selectedTotalQuantity = computed(() => {
  return cartItems.value.filter(item => item.selected).reduce((total, item) => total + item.quantity, 0)
})

// 计算购物车总价
export const cartTotalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 计算选中商品的总价
export const selectedTotalPrice = computed(() => {
  return cartItems.value.filter(item => item.selected).reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 获取购物车商品列表
export const getCartItems = () => cartItems.value

// 移除选中的商品
export const removeSelectedItems = () => {
  cartItems.value = cartItems.value.filter(item => !item.selected)
}

// 订单数据存储
export const orderData = ref({
  items: [],
  totalPrice: 0,
  totalCount: 0,
  orderTime: null
})

// 创建订单
export const createOrder = (items, totalPrice, totalCount) => {
  orderData.value = {
    items: [...items], // 复制商品数组
    totalPrice: totalPrice,
    totalCount: totalCount,
    orderTime: new Date()
  }
  console.log('Order created:', orderData.value)
}

// 获取订单数据
export const getOrderData = () => {
  return orderData.value
}

// 导出购物车状态
export { cartItems }
