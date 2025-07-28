<template>
  <div class="page-layout">
    <!-- 头部导航组件 -->
    <HeaderNavigation />
    
    <!-- 页面内容插槽 -->
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import HeaderNavigation from './HeaderNavigation.vue'
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
  min-width: 1400px;
  width: 100%;
  position: relative;
}

.page-content {
  max-width: 100%;
  margin: 0px auto;
  padding: 0;
  min-width: 1400px;
}
</style>

<!-- 全局样式，确保页面滚动条正常工作 -->
<style>
body {
  overflow-x: auto !important;
  min-width: 1400px;
}

html {
  overflow-x: auto !important;
}
</style>
