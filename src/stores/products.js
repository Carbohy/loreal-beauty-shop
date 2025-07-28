import { ref } from 'vue'

// 商品数据
export const products = ref([
  {
    id: 1,
    image: new URL('@/assets/product1.png', import.meta.url).href,
    title: '欧莱雅PRO控油蓬松洗护套组 高峰预售加享 限时4折',
    price: '140.00',
    originalPrice: '350.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '洗护',
    brand: 'special', // 添加品牌标识
    specifications: [
      { name: '【部分含电商退货】理发聚新的5支装对护保湿40ml', price: '140.00', originalPrice: '350.00', image: new URL('@/assets/product1.png', import.meta.url).href, stock: 50 }
    ]
  },
  {
    id: 2,
    image: new URL('@/assets/product2.png', import.meta.url).href,
    title: '美宝莲眼唇卸妆液套装',
    price: '49.00',
    originalPrice: '245.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '彩妆',
    brand: 'special',
    specifications: [
      { name: '自己液200ml', price: '89.00', originalPrice: '180.00', image: new URL('@/assets/product2.png', import.meta.url).href, stock: 1 },
      { name: '【部分含电商退货】自发流发水500ml', price: '49.00', originalPrice: '245.00', image: new URL('@/assets/product2.png', import.meta.url).href, stock: 45 },
      { name: '【部分含电商退货】自发刘发水200ml', price: '120.00', originalPrice: '300.00', image: new URL('@/assets/product2.png', import.meta.url).href, stock: 25 }
    ]
  },
  {
    id: 3,
    image: new URL('@/assets/product3.png', import.meta.url).href,
    title: '欧莱雅防脱洗护套装',
    price: '159.00',
    originalPrice: '558.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'special',
    specifications: [
      { name: '30ml套装', price: '159.00', originalPrice: '558.00', image: new URL('@/assets/product3.png', import.meta.url).href, stock: 40 },
      { name: '50ml豪华版', price: '299.00', originalPrice: '680.00', image: new URL('@/assets/product1.png', import.meta.url).href, stock: 20 }
    ]
  },
  {
    id: 4,
    image: new URL('@/assets/product4.png', import.meta.url).href,
    title: '卡诗菁纯护发套装',
    price: '330.00',
    originalPrice: '1100.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '洗护',
    brand: 'special',
    specifications: [
      { name: '250ml洗发水+护发素', price: '330.00', originalPrice: '1100.00', image: new URL('@/assets/product4.png', import.meta.url).href, stock: 35 },
      { name: '500ml专业装', price: '560.00', originalPrice: '1580.00', image: new URL('@/assets/product4.png', import.meta.url).href, stock: 15 },
      { name: '100ml旅行装', price: '180.00', originalPrice: '450.00', image: new URL('@/assets/product4.png', import.meta.url).href, stock: 60 }
    ]
  },
  {
    id: 5,
    image: new URL('@/assets/product1.png', import.meta.url).href,
    title: '卡诗黑钻洗护套装',
    price: '120.00',
    originalPrice: '399.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '洗护',
    brand: 'special',
    specifications: [
      { name: '250ml基础套装', price: '120.00', originalPrice: '399.00', image: new URL('@/assets/product1.png', import.meta.url).href, stock: 55 },
      { name: '500ml豪华套装', price: '250.00', originalPrice: '699.00', image: new URL('@/assets/product1.png', import.meta.url).href, stock: 28 }
    ]
  },
  {
    id: 6,
    image: new URL('@/assets/product2.png', import.meta.url).href,
    title: 'YSL黑管唇釉LIBRE+奢华610',
    price: '52.00',
    originalPrice: '273.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '彩妆',
    brand: 'special',
    specifications: [
      { name: '6ml经典装', price: '52.00', originalPrice: '273.00', image: new URL('@/assets/product2.png', import.meta.url).href, stock: 42 },
      { name: '6ml限量版', price: '88.00', originalPrice: '350.00', image: new URL('@/assets/product2.png', import.meta.url).href, stock: 18 }
    ]
  },
  {
    id: 7,
    image: new URL('@/assets/product3.png', import.meta.url).href,
    title: '欧莱雅PRO控油洗护套组',
    price: '140.00',
    originalPrice: '350.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '洗护',
    brand: 'special',
    specifications: [
      { name: '300ml控油套装', price: '140.00', originalPrice: '350.00', image: new URL('@/assets/product3.png', import.meta.url).href, stock: 38 },
      { name: '500ml专业装', price: '199.00', originalPrice: '499.00', image: new URL('@/assets/product3.png', import.meta.url).href, stock: 22 }
    ]
  },
  {
    id: 8,
    image: new URL('@/assets/product4.png', import.meta.url).href,
    title: '圣罗兰黑管丝绒唇膏套装',
    price: '419.00',
    originalPrice: '1635.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '彩妆',
    brand: 'special',
    specifications: [
      { name: '3.8g经典色号', price: '419.00', originalPrice: '1635.00', image: new URL('@/assets/product4.png', import.meta.url).href, stock: 25 },
      { name: '3.8g限量色号', price: '520.00', originalPrice: '1890.00', image: new URL('@/assets/product4.png', import.meta.url).href, stock: 12 },
      { name: '3.8g套装(3支)', price: '999.00', originalPrice: '3999.00', image: new URL('@/assets/product4.png', import.meta.url).href, stock: 8 }
    ]
  },





  // 修丽可品牌产品数据
  {
    id: 101,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '修丽可高浓度喜美胶原蛋白精华',
    price: '354.00',
    originalPrice: '1180.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals', // 修丽可品牌标识
    specifications: [
      { name: '修丽可高浓度喜美胶原蛋白精华30ml', price: '354.00', originalPrice: '1180.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 45 },
      { name: '修丽可高浓度喜美胶原蛋白精华50ml', price: '568.00', originalPrice: '1890.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 25 },
      { name: '修丽可高浓度喜美胶原蛋白精华100ml', price: '1068.00', originalPrice: '3560.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 12 }
    ]
  },
  {
    id: 102,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '【部分含电商退货】修丽可',
    price: '312.00',
    originalPrice: '1040.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals',
    specifications: [
      { name: '修丽可维C精华30ml', price: '312.00', originalPrice: '1040.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 32 },
      { name: '修丽可维C精华50ml', price: '488.00', originalPrice: '1625.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 18 }
    ]
  },
  {
    id: 103,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '【部分含电商退货】修丽可',
    price: '276.00',
    originalPrice: '920.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals',
    specifications: [
      { name: '修丽可B5精华30ml', price: '276.00', originalPrice: '920.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 28 }
    ]
  },
  {
    id: 104,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '【部分含电商退货】修丽可',
    price: '216.00',
    originalPrice: '720.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals',
    specifications: [
      { name: '修丽可抗氧化精华30ml', price: '216.00', originalPrice: '720.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 25 }
    ]
  },
  {
    id: 105,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '【部分含电商退货】修丽可',
    price: '219.00',
    originalPrice: '730.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals',
    specifications: [
      { name: '修丽可洁面乳150ml', price: '219.00', originalPrice: '730.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 40 },
      { name: '修丽可洁面乳250ml', price: '328.00', originalPrice: '1095.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 22 },
      { name: '修丽可洁面乳500ml', price: '598.00', originalPrice: '1995.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 8 }
    ]
  },
  {
    id: 106,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '【部分含电商退货】修丽可',
    price: '165.00',
    originalPrice: '550.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals',
    specifications: [
      { name: '修丽可爽肤水200ml', price: '165.00', originalPrice: '550.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 35 },
      { name: '修丽可爽肤水400ml', price: '298.00', originalPrice: '995.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 18 }
    ]
  },
  {
    id: 107,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '修丽可皮肤修护精华',
    price: '516.00',
    originalPrice: '1720.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals',
    specifications: [
      { name: '修丽可皮肤修护精华50ml', price: '516.00', originalPrice: '1720.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 15 },
      { name: '修丽可皮肤修护精华100ml', price: '968.00', originalPrice: '3225.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 8 }
    ]
  },
  {
    id: 108,
    image: new URL('@/assets/skin-care1.png', import.meta.url).href,
    title: '修丽可植萃舒缓修护精华',
    price: '187.52',
    originalPrice: '625.00',
    category: '【部分含电商退货】',
    status: 'hot',
    statusText: '护肤',
    brand: 'skinceuticals',
    specifications: [
      { name: '修丽可植萃舒缓修护蘭华30ml', price: '187.52', originalPrice: '625.00', image: new URL('@/assets/skin-care1.png', import.meta.url).href, stock: 22 }
    ]
  }
])

// 根据分类筛选商品
export const getProductsByCategory = (category) => {
  if (category === '全部') {
    return products.value
  }
  return products.value.filter(product => product.category === category)
}

// 根据状态筛选商品
export const getProductsByStatus = (status) => {
  if (status === '全部') {
    return products.value
  }
  return products.value.filter(product => product.statusText === status)
}

// 根据ID获取商品
export const getProductById = (id) => {
  return products.value.find(product => product.id === id)
}

// 搜索商品 - 模糊搜索
export const searchProducts = (keyword) => {
  if (!keyword.trim()) {
    return []
  }
  
  const lowerKeyword = keyword.toLowerCase()
  return products.value.filter(product => 
    product.title.toLowerCase().includes(lowerKeyword) ||
    product.category.toLowerCase().includes(lowerKeyword) ||
    product.statusText.toLowerCase().includes(lowerKeyword)
  )
}

// 精准搜索商品 - 完全匹配title
export const exactSearchProducts = (keyword) => {
  if (!keyword.trim()) {
    return []
  }
  
  const lowerKeyword = keyword.toLowerCase()
  return products.value.filter(product => 
    product.title.toLowerCase() === lowerKeyword
  )
}

// 智能搜索 - 支持模糊和精准搜索
export const smartSearchProducts = (keyword, isExactMatch = false) => {
  if (!keyword.trim()) {
    return []
  }
  
  if (isExactMatch) {
    return exactSearchProducts(keyword)
  } else {
    return searchProducts(keyword)
  }
}

// 获取所有分类
export const getCategories = () => {
  const categories = new Set()
  products.value.forEach(product => {
    categories.add(product.category)
  })
  return ['全部', ...Array.from(categories)]
}

// 获取所有状态
export const getStatuses = () => {
  const statuses = new Set()
  products.value.forEach(product => {
    statuses.add(product.statusText)
  })
  return ['全部', ...Array.from(statuses)]
}

// 库存管理功能
// 减少指定商品规格的库存
export const reduceStock = (productId, specIndex, quantity) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.specifications && product.specifications[specIndex]) {
    const spec = product.specifications[specIndex]
    if (spec.stock >= quantity) {
      spec.stock -= quantity
      console.log(`商品 ${product.title} 规格 ${spec.name} 库存减少 ${quantity}，剩余库存：${spec.stock}`)
      return true
    } else {
      console.warn(`商品 ${product.title} 规格 ${spec.name} 库存不足！当前库存：${spec.stock}，需要：${quantity}`)
      return false
    }
  }
  return false
}

// 检查库存是否充足
export const checkStock = (productId, specIndex, quantity) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.specifications && product.specifications[specIndex]) {
    const spec = product.specifications[specIndex]
    return spec.stock >= quantity
  }
  return false
}

// 获取指定规格的库存数量
export const getStock = (productId, specIndex) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.specifications && product.specifications[specIndex]) {
    return product.specifications[specIndex].stock
  }
  return 0
}

// 批量减少库存（用于结算时）
export const batchReduceStock = (cartItems) => {
  const stockReductions = []
  let allStockSufficient = true
  
  // 首先检查所有商品的库存是否充足
  for (const item of cartItems) {
    if (!checkStock(item.productId, item.selectedSpecIndex, item.quantity)) {
      allStockSufficient = false
      const product = products.value.find(p => p.id === item.productId)
      const spec = product?.specifications[item.selectedSpecIndex]
      console.error(`库存不足：${product?.title} - ${spec?.name}，需要：${item.quantity}，可用：${spec?.stock || 0}`)
    }
  }
  
  // 如果所有商品库存都充足，则执行库存扣减
  if (allStockSufficient) {
    for (const item of cartItems) {
      if (reduceStock(item.productId, item.selectedSpecIndex, item.quantity)) {
        stockReductions.push({
          productId: item.productId,
          specIndex: item.selectedSpecIndex,
          quantity: item.quantity
        })
      }
    }
    return { success: true, reductions: stockReductions }
  }
  
  return { success: false, message: '部分商品库存不足' }
}

// 恢复库存（取消订单时使用）
export const restoreStock = (productId, specIndex, quantity) => {
  const product = products.value.find(p => p.id === productId)
  if (product && product.specifications && product.specifications[specIndex]) {
    const spec = product.specifications[specIndex]
    spec.stock += quantity
    console.log(`商品 ${product.title} 规格 ${spec.name} 库存恢复 ${quantity}，当前库存：${spec.stock}`)
    return true
  }
  return false
}

// 批量恢复库存（取消订单时使用）
export const batchRestoreStock = (orderItems) => {
  const stockRestorations = []
  
  for (const item of orderItems) {
    if (restoreStock(item.productId, item.selectedSpecIndex, item.quantity)) {
      stockRestorations.push({
        productId: item.productId,
        specIndex: item.selectedSpecIndex,
        quantity: item.quantity
      })
    }
  }
  
  return { success: true, restorations: stockRestorations }
}
