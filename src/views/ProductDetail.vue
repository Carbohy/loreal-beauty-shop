<![CDATA[<template>
  <div class="product-detail">
    <div class="product-container">
      <div class="product-image">
        <el-image :src="product.image" fit="cover" />
      </div>
      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-price">¥{{ product.price }}</div>
        <div class="product-description">{{ product.description }}</div>
        <div class="product-actions">
          <el-input-number v-model="quantity" :min="1" :max="99" />
          <el-button type="primary" @click="addToCart">加入购物车</el-button>
          <el-button type="danger">立即购买</el-button>
        </div>
      </div>
    </div>
    <div class="product-details">
      <el-tabs>
        <el-tab-pane label="商品详情">
          <div class="detail-content" v-html="product.details"></div>
        </el-tab-pane>
        <el-tab-pane label="规格参数">
          <div class="specifications">
            <div v-for="(spec, index) in product.specifications" :key="index" class="spec-item">
              <span class="spec-label">{{ spec.label }}:</span>
              <span class="spec-value">{{ spec.value }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户评价">
          <!-- 评价组件将在后续实现 -->
          <div class="reviews">
            <p>商品评价功能开发中...</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const quantity = ref(1)

// 模拟商品数据，实际项目中应该从API获取
const product = reactive({
  id: route.params.id,
  name: '兰蔻美妆产品',
  price: 999,
  image: '/images/product-placeholder.jpg',
  description: '这是一个兰蔻美妆产品的详细描述...',
  details: '<p>产品详细信息...</p>',
  specifications: [
    { label: '产品规格', value: '50ml' },
    { label: '产品类型', value: '护肤品' },
    { label: '适用肤质', value: '所有肤质' }
  ]
})

const addToCart = () => {
  ElMessage.success(`已将 ${quantity.value} 件商品添加到购物车`)
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

.product-detail {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-width: 1200px; /* 防止布局变乱 */
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  min-width: 1000px; /* 防止布局变乱 */
}

.product-image {
  border: 1px solid #eee;
  padding: 1rem;
}

.product-image :deep(.el-image) {
  width: 100%;
  height: 400px;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 2rem;
  color: #e4007f;
  margin-bottom: 1rem;
}

.product-description {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.product-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.detail-content {
  padding: 1rem;
}

.specifications {
  padding: 1rem;
}

.spec-item {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.spec-label {
  width: 120px;
  color: #666;
}

.spec-value {
  color: #333;
}

.reviews {
  padding: 1rem;
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }
}
</style>]]>
