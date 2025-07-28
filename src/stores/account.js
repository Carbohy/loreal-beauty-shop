import { ref, computed } from 'vue'

// 账户状态
const totalBalance = ref(15000.0) // 总额度
const idBalance = ref(10000.0) // ID额度
const orderCount = ref(0) // 订单数量
const maxOrders = ref(10) // 最大订单数
const minOrderAmount = ref(300) // 最低起订金额

// 计时器相关状态
const loginStartTime = ref(null) // 登录开始时间
const timerElapsed = ref(0) // 已过时间（毫秒）
const isTimerRunning = ref(false) // 计时器是否运行中
let timerInterval = null // 计时器间隔

// 计算剩余总额度
export const remainingTotalBalance = computed(() => {
    return totalBalance.value
})

// 计算剩余ID额度
export const remainingIdBalance = computed(() => {
    return idBalance.value
})

// 计算订单状态
export const orderStatus = computed(() => {
    return `${orderCount.value}/${maxOrders.value}`
})

// 计算格式化的时间显示
export const formattedTime = computed(() => {
    if (!isTimerRunning.value && timerElapsed.value === 0) {
        return '00:00:00:000'
    }
    
    const totalMs = timerElapsed.value
    const hours = Math.floor(totalMs / (1000 * 60 * 60))
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000)
    const milliseconds = totalMs % 1000
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`
})

// 启动计时器
export const startTimer = () => {
    if (isTimerRunning.value) return
    
    loginStartTime.value = Date.now()
    isTimerRunning.value = true
    
    timerInterval = setInterval(() => {
        if (orderCount.value >= maxOrders.value) {
            stopTimer()
            return
        }
        timerElapsed.value = Date.now() - loginStartTime.value
    }, 10) // 每10毫秒更新一次，确保毫秒级精度
}

// 停止计时器
export const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
    isTimerRunning.value = false
}

// 重置计时器
export const resetTimer = () => {
    stopTimer()
    loginStartTime.value = null
    timerElapsed.value = 0
}

// 处理结算 - 扣除总额度并增加订单数
export const processCheckout = (totalAmount, itemCount) => {
    if (totalAmount < minOrderAmount.value) {
        return { 
            success: false, 
            message: `订单金额不足，最低起订金额为¥${minOrderAmount.value}` 
        }
    }
    
    if (totalBalance.value < totalAmount) {
        return { 
            success: false, 
            message: '账户余额不足' 
        }
    }
    
    if (orderCount.value >= maxOrders.value) {
        return { 
            success: false, 
            message: '已达到最大订单数量限制' 
        }
    }
    
    totalBalance.value -= totalAmount
    orderCount.value += 1  // 每次结算只增加1个订单，不管商品数量
    
    // 检查是否达到最大订单数，如果是则停止计时器
    if (orderCount.value >= maxOrders.value) {
        stopTimer()
    }
    
    return { 
        success: true, 
        message: '结算成功' 
    }
}

// 取消订单 - 回退总额度并减少订单数
export const cancelOrderBalance = (totalAmount) => {
    const wasAtMaxOrders = orderCount.value >= maxOrders.value
    
    totalBalance.value += totalAmount
    if (orderCount.value > 0) {
        orderCount.value -= 1
    }
    
    // 如果之前达到了最大订单数，现在少于最大订单数，且有登录开始时间，则重新启动计时器
    if (wasAtMaxOrders && orderCount.value < maxOrders.value && loginStartTime.value) {
        // 计时器从停止的地方继续，不重新设置loginStartTime
        isTimerRunning.value = true
        
        timerInterval = setInterval(() => {
            if (orderCount.value >= maxOrders.value) {
                stopTimer()
                return
            }
            timerElapsed.value = Date.now() - loginStartTime.value
        }, 10) // 每10毫秒更新一次，确保毫秒级精度
    }
}

// 重置账户状态（可选功能）
export const resetAccount = () => {
    totalBalance.value = 15000.0
    idBalance.value = 10000.0
    orderCount.value = 0
    resetTimer()
}

// 导出所有状态
export {
    totalBalance,
    idBalance,
    orderCount,
    maxOrders,
    minOrderAmount,
    loginStartTime,
    timerElapsed,
    isTimerRunning
}
