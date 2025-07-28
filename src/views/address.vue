
<template>
  <div class="address-container">
    <HeaderNavigation />

     <!-- 主要内容区域 -->
    <div class="address-main-content">
      <div class="breadcrumb">
        <div class="breadcrumb-content">
            <router-link to="/home" class="breadcrumb-link">首页</router-link>
            <span class="breadcrumb-separator">></span>
            <router-link to="/orders" class="breadcrumb-link">我的账户</router-link>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-current">地址管理</span>
        </div>
        </div>

    

    <div class="content-layout">
      <!-- 左侧导航菜单 -->
        <div class="sidebar">
          <div class="sidebar-menu">
            <div class="menu-item" @click="handleMyOrders">
              <span>我的订单</span>
            </div>
            <div class="menu-item active">
              <span>地址管理</span>
            </div>
            <div class="menu-item" @click="handleChangePassword">
              <span>修改密码</span>
            </div>
          </div>
        </div>

    </div>
  </div>
</div>

</template>



<script setup>
// 引入组件
import HeaderNavigation from '@/components/HeaderNavigation.vue'


// 引入 Vue Router
import { useRouter } from 'vue-router'
const router = useRouter()  

// 跳转到我的订单页面
const handleMyOrders = () => {
  router.push('/orders')
}
//跳转修改密码页面
const handleChangePassword = () => {
  router.push('/change-password')
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

.address-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  min-width: 1400px; /* 防止布局变乱 */
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
.address-main-content {
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



</style>