<!-- <template>
  <div class="login-container">
    
    <div class="language-switch">
      <div>
        <div class="logo">
          <img src="@/assets/logo.png" alt="L'OREAL CHINA">
        </div>

        <span class="active">简体中文</span>
        <span class="divider">|</span>
        <span>English</span>
      </div>
    </div>
    
    <div class="login-content">
      <div class="product-showcase">
        <div><img src="@/assets/login-banner.jpg" alt="L'Oreal Products" class="product-image">
        
        </div>
      </div>
      <div class="login-box">
        <h1 class="brand-title">欧莱雅员工内卖</h1>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="用户名/邮箱"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <div class="slider-captcha">
              <div class="slider-wrap">
                <div class="slider-bar">
                  <span class="slider-text">拖住滑块，完成验证</span>
                </div>
                <div 
                  class="slider-button"
                  :class="{ 'verified': isVerified }"
                  @mousedown="startDrag"
                  :style="{ left: sliderLeft + 'px' }"
                >
                  <span class="iconfont">➜</span>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              class="login-button" 
              @click="handleLogin"
              :disabled="!isVerified"
            >立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

     <div class="line"></div>

    <div class="footer">
      <div class="footer-content">
        <div class="footer-item">
          <span>欧莱雅内卖客服电话：400-820-6362</span>
          <span class="divider"></span>
          <span>欧莱雅内卖客服邮箱：loreal@sf-mail.sf-express.com</span>
          <span class="divider"></span>
          <span>隐私政策</span>
          <span class="divider"></span>
          <span>cookie政策</span>
        </div>
        <div class="footer-item text">
          国家药监局提示您：请正确认识化妆品功效，化妆品不能代替药品，不能治疗皮肤病等疾病
        </div>
        <div class="footer-item licenses">
          <img src="@/assets/license1.png" alt="营业执照" class="license-img">
          <img src="@/assets/license2.png" alt="网络经营许可证" class="license-img">
        </div>
      </div>
    </div>
  </div>
</template> -->

<template>
  <div class="login-container">
    
    <!-- 友情提醒弹窗 -->
    <div v-if="showWarningModal" class="warning-modal-overlay" @click.self="closeModal">
      <div class="warning-modal">
        <h3 class="warning-title">友情提醒</h3>
        <div class="warning-content">
          <p class="warning-text red">同一账号在同一时间内只能由一个用户登入，重复登入会导致先前访问自动退出。</p>
          <p class="warning-text">员工内卖账号文仅限本准员工使用，不得转让，请妥善保管您的账号安全。</p>
          <p class="warning-text">内卖所购产品不得转售或者以其他形式牟利。</p>
        </div>
        <button 
          class="confirm-btn" 
          :disabled="!canConfirm" 
          @click="confirmWarning"
          :class="{ disabled: !canConfirm }"
        >
          确认 {{ !canConfirm ? `(${countdown}s)` : '' }}
        </button>
      </div>
    </div>

    <div class="language-switch">
      <div>
        <div class="logo">
          <img src="@/assets/logo.png" alt="L'OREAL CHINA">
        </div>

        <span class="active">简体中文</span>
        <span class="divider">|</span>
        <span>English</span>
      </div>
    </div>
    
    <div class="login-content">
      <div class="product-showcase">
        <div><img src="@/assets/login-banner.jpg" alt="L'Oreal Products" class="product-image">
        
        </div>
      </div>

      <div class="login-box">
        <h1 class="brand-title">欧莱雅员工内卖</h1>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username" >
            <el-input 
              v-model="loginForm.username" 
              placeholder="用户名/邮箱"

            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <div class="slider-captcha">
              <div class="slider-wrap">
                <div class="slider-bar">
                  <span class="slider-text">拖住滑块，完成验证</span>
                </div>
                <div 
                  class="slider-button"
                  :class="{ 'verified': isVerified }"
                  @mousedown="startDrag"
                  :style="{ left: sliderLeft + 'px' }"
                >
                  <span class="iconfont">➜</span>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              class="login-button" 
              @click="handleLogin"
              :disabled="!isVerified"
            >立即登录</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="login-options">
          <router-link to="/forgot-password">忘记密码？</router-link>
          <router-link to="/register">注册新账号</router-link>
        </div> -->
      </div>
    </div>

    <!-- // 横线 -->
     <div class="line"></div>

    <div class="footer">
      <div class="footer-content">
        <div class="footer-item">
          <span>欧莱雅内卖客服电话：400-820-6362</span>
          <span class="divider"></span>
          <span>欧莱雅内卖客服邮箱：loreal@sf-mail.sf-express.com</span>
          <span class="divider"></span>
          <span>隐私政策</span>
          <span class="divider"></span>
          <span>cookie政策</span>
        </div>
        <div class="footer-item text">
          国家药监局提示您：请正确认识化妆品功效，化妆品不能代替药品，不能治疗皮肤病等疾病
        </div>
        <div class="footer-item licenses">
          <img src="@/assets/license1.png" alt="营业执照" class="license-img">
          <img src="@/assets/license2.png" alt="网络经营许可证" class="license-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { startTimer } from '@/stores/account.js'
import { setAppNavigation } from '@/router/index.js'

const router = useRouter()
const loginFormRef = ref(null)

// 友情提醒弹窗相关
const showWarningModal = ref(true)
const canConfirm = ref(false)
const countdown = ref(5)   //设置弹窗时间
let countdownTimer = null

const loginForm = reactive({
  username: '',
  password: ''
})

const sliderLeft = ref(0)
const isVerified = ref(false)
const isDragging = ref(false)
const startX = ref(0)
const sliderBarWidth = ref(0)

// 页面加载时启动倒计时
onMounted(() => {
  startCountdown()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

// 启动倒计时
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      canConfirm.value = true
      clearInterval(countdownTimer)
    }
  }, 1000)
}

// 确认友情提醒
const confirmWarning = () => {
  if (canConfirm.value) {
    showWarningModal.value = false
  }
}

// 关闭弹窗（点击背景）
const closeModal = () => {
  // 可以选择是否允许点击背景关闭，这里暂时禁用
  // if (canConfirm.value) {
  //   showWarningModal.value = false
  // }
}

const startDrag = (e) => {
  if (isVerified.value) return
  isDragging.value = true
  startX.value = e.clientX
  sliderBarWidth.value = document.querySelector('.slider-bar').offsetWidth
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  
  const moveX = e.clientX - startX.value
  const maxMove = sliderBarWidth.value - 40 // 40 is slider button width
  
  sliderLeft.value = Math.min(Math.max(moveX, 0), maxMove)
  
  // 更新进度条宽度
  const progressPercent = (sliderLeft.value / maxMove) * 100
  const sliderBar = document.querySelector('.slider-bar')
  if (sliderBar) {
    sliderBar.style.setProperty('--slider-progress', `${progressPercent}%`)
  }
  
  if (sliderLeft.value >= maxMove) {
    isVerified.value = true
    stopDrag()
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  if (!isVerified.value) {
    sliderLeft.value = 0
    // 重置进度条
    const sliderBar = document.querySelector('.slider-bar')
    if (sliderBar) {
      sliderBar.style.setProperty('--slider-progress', '0%')
    }
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  if (!loginFormRef.value) return

  loginFormRef.value.validate((valid) => {
    if (valid) {
      // 验证用户名和密码
      if (loginForm.username === 'admin' && loginForm.password === '123456' && isVerified.value) {
        ElMessage.success('登录成功')
        startTimer() // 启动计时器
        setAppNavigation() // 标记为应用内导航
        router.push({ path: '/home', query: { fromLogin: 'true' } })  // 跳转到首页，标记来自登录
      } else {
        ElMessage.error('用户名或密码错误')
        isVerified.value = false
        sliderLeft.value = 0
      }
    }
  })
}
</script>

<style scoped>
/* 友情提醒弹窗样式 */
.warning-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.warning-modal {
  background: white;
  padding: 35px;
  border-radius: 0px;
  width: 500px;
  height: 310px;
  max-width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
}

.warning-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  margin-top: 10px;
}

.warning-content {
  margin-bottom: 30px;
  margin-top: 35px;
  margin-inline: 16px;

}

.warning-text {
  margin: 5px 0;
  font-size: 12px;
  line-height: 1.6;
  color: #666;
}

.warning-text.red {
  color: #e74c3c;
  font-weight: 500;
}

.confirm-btn {
  width: 55%;
  height: 34px;
  background: #b69364;
  color: white;
  border: none;
  /* border-radius: 4px; */
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: block;
  margin: 0 auto;
  /* margin-bottom: 50px; */
}

.confirm-btn:hover:not(.disabled) {
  background: #a57f4e;
}

.confirm-btn.disabled {
  background: #cccccc;
  cursor: not-allowed;
  color: #999;
}
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;
  min-width: 1200px; /* 设置页面最小宽度，小于此宽度时显示水平滚动条 */
}

body {
  overflow-x: auto; /* 确保可以水平滚动 */
}

.logo {
  position: fixed;
  top: 30px;  
  left: 28%;
  transform: translateX(-50%);
  z-index: 10;
  background-color: white;
  padding: 10px 20px;
  border-radius: 4px;
}

.logo img {
  height: 35px;
  width: auto;
  display: block;
}

.language-switch {
  position: absolute;
  top: 50px;
  right: 350px;
  font-size: 14px;
  color: #666;
}

.language-switch span {
  cursor: pointer;
}

.language-switch span.active {
  color: #000;
}

.language-switch .divider {
  margin: 0 10px;
  color: #ddd;
}

.login-content {
  flex: 1;
  display: flex;
  align-items: stretch;
  position: relative;
  min-width: 1200px; /* 保持登录内容区域的最小宽度 */
}

.product-showcase {
  flex: 1;
  height: 500px;
  background: #870d2c;
  overflow: hidden;
  position: relative;
  margin-top: 100px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-box {
  width: 320px;
  height: 370px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  position: absolute;
  /* left: 800px; */
  left: 55%;
  top: 57%;
  transform: translateY(-50%);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  /* border-radius: 4px; */
  z-index: 1;
}

.brand-title {
  text-align: center;
  margin: -1rem auto 2.5rem;
  font-size: 15px;
  color: #333;
  font-weight: 600;
  margin-top: 14px;
}

.login-button {
  width: 100%;
  height: 30px;
  font-size: 10px;
  background: #b69364;
  border-color: #b69364;
  border-radius: 0px;
}

.login-button:hover {
  background: #a57f4e;
  border-color: #a57f4e;
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 14px;
}

.login-options a {
  color: #666;
  text-decoration: none;
}

.login-options a:hover {
  color: #b69364;
}

.line {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
}

.footer {
  background: #fff;
  padding: 1rem 0;
  /* border-top: 1px solid #eee; */
  min-width: 1200px; /* 保持页脚的最小宽度 */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-item {
  margin: 10px 0;
  color: #666;
  font-size: 10px;
}

.footer-item .text{
  color: #666;
  font-size: 10px;  
}

.footer-item .divider {
  margin: 0 10px;
  color: #ddd;
}

.licenses {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.license-img {
  height: 30px;
}

:deep(.el-input__wrapper) {
  background-color: #f5f5f5;
  border: none;
  height: 30px;
  width: 100%;
  margin: 0 auto;
  border-radius: 0px;
}

:deep(.el-input__inner) {
  height: 36px;
  font-size: 13px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

.slider-captcha {
  width: 100%;
  padding: 5px 0;
  margin-bottom: 15px;
}

.slider-wrap {
  position: relative;
  width: 100%;
  height: 30px;
  background: #f5f5f5;
  border-radius: 0px;
  overflow: hidden;
}

.slider-bar {
  position: relative;
  height: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 2px;
  background: #f9f9f9;
  text-align: center;
}

/* 添加滑块划过的进度条 */
.slider-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #46b407ea, #54d908);
  border-radius: 1px;
  transition: width 0.1s ease;
  width: var(--slider-progress, 0);
  z-index: 1;
}

.slider-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 12px;
  white-space: nowrap;
  user-select: none;
  z-index: 2;
}

.slider-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 30px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  z-index: 3;
}

.slider-button .iconfont {
  color: #999;
  font-size: 16px;
}

.slider-button:hover {
  background-color: #f9f9f9;
}

.slider-button.verified {
  background-color: #b69364;
  border-color: #b69364;
}

.slider-button.verified .iconfont {
  color: white;
}
</style>

<style>
/* 全局样式确保滚动条正常工作 */
html, body {
  overflow-x: auto !important;
  min-width: 1200px !important;
}
</style>
