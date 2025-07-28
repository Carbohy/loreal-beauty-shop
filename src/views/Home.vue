<template>
  <PageLayout>
    <!-- 购买规则弹窗 -->
    <el-dialog 
      v-model="showRulesDialog" 
      title="购买规则" 
      width="600px" 
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <div class="rules-content">
        <h3>欧莱雅员工2024/03员工的亲须知</h3>
        <div class="rules-text">
          <p>• 欧莱雅员工内卖仅限于欧莱雅员工，员工须保存好个人账号由本人使用，不得转让。</p>
          <p>• 员工所购产品，仅限自用，不得转售或者以其他形式牟利，否则将追究责任，后果自负。</p>
          <p>• 同一账号在同一时间点只能由一个用户登入，重复同时登入会导致先前访问自动退出。</p>
          <p>• 大众化妆品部单个产品订货数量不超过 10 个；高端化妆品部、皮肤科学美容事业部、专业美发部、欧莱雅国际分销部单个产品订货数量不超过 5 个。</p>
          <p>• 本着可持续发展的精神，本次员工内卖的部分产品为电商退货产品，在购买详情页里会有相关提醒字样。所有电商退货产品经公司大仓分拣检查后上架，原则上符合二次销售标准，但不排除个例。</p>
          <p>• 本次内卖电商退货产品均贴有"电商退货""Ecom Return"字样的标签，如因个例发现质量问题申请退换货，需保留此标签，否则不予退换。</p>
          <p>• 每位员工购买高端化妆品牌总金额不超过10,000元。</p>
          <p>• 每位员工购买所有品牌产品总金额不超过15,000元。</p>
          <p>• 每张订单最小金额不低于300元。</p>
          <p>• 订单数量每人最多不超过10单。</p>
          <p>• 所有订单只接受网上付款（微信或支付宝），需在提交订单后两小时内完成付款。</p>
          <p>• 订单付款后不能更换产品或取消订单，最终订单以实际确认付款后为准。</p>
          <p>• 所有产品以实际发货为准。产品图片及有效期仅供参考。</p>
          <p>• 本次内卖仅提供快递寄送服务，可自由设定收货地址并选择相应快递公司，快递费用按产品（正装+赠品）重量和运输路程计算， 由员工本人负责支付。</p>
          <p>• 请务必于接收产品时检查产品质量，并于签收后48小时内联系客服，除产品质量问题（漏液、破损等）和保留了"电商退货" 字样标签的，其他不接受退货或者换货。</p>
          <p>• 本次内卖有精美礼品赠送，参见网站活动公告信息，所有赠品数量有限，先到先得，送完即止。</p>
          <p>• 客服电话: 400 128 8832（周一~周日09:00-21:00）</p>
          <p>• 客服邮箱 loreal@sfmail.sf-express.com</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          
          <el-button 
            @click="handleAgree" 
            :disabled="!canOperate"
            class="agree-btn"
          >
            我同意 {{ !canOperate ? `(${countdown}s)` : '' }}
          </el-button>

          <el-button 
            @click="handleDisagree" 
            class="disagree-btn"
          >
            我不同意
          </el-button>

        </div>
      </template>
    </el-dialog>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 轮播图区域 -->
      <div class="banner-carousel">
        <el-carousel :interval="3000" height="550px">
          <el-carousel-item v-for="(banner, index) in banners" :key="index">
            <img :src="banner.image" :alt="banner.title" class="carousel-image">
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import PageLayout from '@/components/PageLayout.vue'

const router = useRouter()
const route = useRoute()

const banners = ref([
  {
    image: new URL('@/assets/banner1.jpg', import.meta.url).href,
    title: '轮播图1',
  },
  {
    image: new URL('@/assets/banner2.jpg', import.meta.url).href,
    title: '轮播图2'
  },
  {
    image: new URL('@/assets/banner3.jpg', import.meta.url).href,
    title: '轮播图3'
  }
])

// 弹窗相关状态
const showRulesDialog = ref(false)
const canOperate = ref(false)
const countdown = ref(5)

let countdownTimer = null

// 页面加载时检查是否需要显示弹窗
onMounted(() => {
  // 检查是否从登录页面跳转过来
  const fromLogin = route.query.fromLogin === 'true'
  
  if (fromLogin) {
    showRulesDialog.value = true
    startCountdown()
  }
})

// 启动倒计时
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      canOperate.value = true
      clearInterval(countdownTimer)
    }
  }, 1000)
}

// 处理同意
const handleAgree = () => {
  if (!canOperate.value) return
  
  showRulesDialog.value = false
  //ElMessage.success('欢迎使用欧莱雅员工内购系统')
  
  // 清除定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
}

// 处理不同意
const handleDisagree = () => {
  //if (!canOperate.value) return
  
 //ElMessage.warning('您已选择不同意，将返回登录页面')
  
  // 清除定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  
  // 退出登录，返回登录页面并刷新
  setTimeout(() => {
    window.location.href = '/login'
  }, 100)
}
</script>

<style scoped>
.main-content {
  max-width: 100%;
  margin: 0px auto;
  padding: 0;
  min-width: 1400px;
}

.banner-carousel {
  margin-bottom: 30px;
  width: 100%;
  height: 400px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 购买规则弹窗样式 */
.rules-content {
  padding: 20px;
  line-height: 1;
  margin-inline: 40px;

}

.rules-content h3 {
  color: #333;
  font-size: 14px;
  margin-bottom: 0px;
  /* margin-top: 0px; */
  font-weight: 600;
}

.rules-text {
  color: #666;
  font-size: 14px;
  /* line-height: 1.5; */
  margin-top: 40px;
  max-height: 230px;
  overflow-y: auto;
  /* border: 1px solid #e0e0e0; */
  /* border-radius: 4px; */
  padding: 0px;
  /* background-color: #fafafa; */
}

.rules-text::-webkit-scrollbar {
  width: 8px;
}

.rules-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.rules-text::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.rules-text::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.rules-text p {
  margin-bottom: 2px;
  padding-left: 0;
  line-height: 2;
}

.dialog-footer {
  text-align: center;
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  margin-bottom: 20px;
}

.dialog-footer .el-button {
  margin: 0;
  padding: 12px 30px;
  font-size: 12px;
  border-radius: 0px;
  width: 260px;
  height: 40px;

}

/* 我同意按钮样式 */
.agree-btn {
  background-color: #b69364 !important;
  border-color: #b69364 !important;
  color: white !important;
}

.agree-btn:hover:not(:disabled) {
  background-color: #a08555 !important;
  border-color: #a08555 !important;
}

.agree-btn:disabled {
  background-color: #d4c4a8 !important;
  border-color: #d4c4a8 !important;
  color: #fff !important;
  opacity: 0.6;
}

/* 我不同意按钮样式 */
.disagree-btn {
  background-color: transparent !important;
  border: 1px solid #b69364 !important;
  color: #b69364 !important;
}

.disagree-btn:hover:not(:disabled) {
  background-color: #f8f5f0 !important;
  border-color: #a08555 !important;
  color: #a08555 !important;
}

.disagree-btn:disabled {
  background-color: transparent !important;
  border-color: #d4c4a8 !important;
  color: #d4c4a8 !important;
  opacity: 0.6;
}

/* Element Plus 弹窗样式覆盖 */
:deep(.el-dialog) {
  border-radius: 0px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 590px;
}

:deep(.el-dialog__header) {
  /* background: #f8f9fa; */
  padding: 20px;
  margin-top: 30px;
  /* border-bottom: 1px solid #e9ecef; */
  /* border-radius: 8px 8px 0 0; */
}

:deep(.el-dialog__title) {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  
}

:deep(.el-dialog__body) {
  padding: 0;

}

:deep(.el-dialog__footer) {
  /* background: #f8f9fa; */
  /* border-top: 1px solid #e9ecef; */
  border-radius: 0 0 8px 8px;  
  padding: 0;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(0, 0, 0, 0.5);
}

:deep(.el-carousel__indicators) {
  bottom: 20px;
}

:deep(.el-carousel__button) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
}

:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #fff;
}
</style>
