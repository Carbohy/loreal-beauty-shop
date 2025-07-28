<template>
  <PageLayout>
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/home" class="breadcrumb-link">首页</router-link>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-current">示例页面</span>
      </div>

      <!-- 页面内容 -->
      <div class="page-container">
        <h1>这是一个使用模板的示例页面</h1>
        <p>您可以在这里添加页面特有的内容，顶部导航会自动包含。</p>
        
        <div class="content-section">
          <h2>主要特点：</h2>
          <ul>
            <li>✅ 顶部信息栏（显示余额、订单状态等）</li>
            <li>✅ 次级导航栏（包含Logo、用户下拉框、右侧导航）</li>
            <li>✅ 主导航栏（包含所有主要导航链接）</li>
            <li>✅ 品牌悬停面板（皮肤科学美容事业部）</li>
            <li>✅ 搜索功能</li>
            <li>✅ 购物车悬停面板</li>
            <li>✅ 响应式设计</li>
          </ul>
        </div>

        <div class="usage-section">
          <h2>如何使用：</h2>
          <ol>
            <li>在新页面的 template 中使用 <code>&lt;PageLayout&gt;</code> 组件</li>
            <li>在组件内部添加您的页面内容</li>
            <li>在 script 中导入 PageLayout 组件</li>
            <li>无需额外配置导航逻辑</li>
          </ol>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/PageLayout.vue'
</script>

<style scoped>
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

.page-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.page-container h1 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.page-container h2 {
  color: #666;
  margin: 20px 0 15px 0;
  font-size: 18px;
}

.content-section, .usage-section {
  margin: 30px 0;
}

.content-section ul {
  list-style: none;
  padding: 0;
}

.content-section li {
  padding: 8px 0;
  font-size: 14px;
  color: #666;
}

.usage-section ol {
  padding-left: 20px;
}

.usage-section li {
  padding: 5px 0;
  font-size: 14px;
  color: #666;
}

code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #e74c3c;
}
</style>
