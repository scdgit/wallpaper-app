<script lang="ts" setup>
import QrCode from '@/components/QrCode.vue'
import { queryPayOrderApi } from '@/api/pay'
import { saveImgToAlbum, copyOrderNum } from '@/utils'
import { tokenRequest } from '@/utils/request'
import { updateUserInfo } from '@/hooks/user'
import type { orderType } from '@/type'

const qrcodeUrl = ref<string>(null)  // 支付二维码链接
const noticeTxt = ref<string>() // 提示文本
const countdown = ref<number>(5) // 倒计时
const payStatus = ref<boolean>(false) // 支付状态
let params = ref<orderType>() // 路由参数
let payTimer = null
let outTradeNo: string // 支付的订单号
let isTimeout = ref<boolean>(false) // 是否超时
let codeBase64 = ref<string>() // 二维码
let uId: number // 用户ID
let orderIntegral: number // 订单积分

onLoad((options) => {
   params.value = JSON.parse(options.ordeInfo)
   outTradeNo = params.value.out_trade_no
   qrcodeUrl.value = params.value.qr_code
   uId = params.value.u_id
   orderIntegral = params.value.order_integral
   paymentListen()
})

// 判断支付是否完成
const paymentListen = () => {
   if (payStatus.value) return noticeTxt.value = '该订单已完成'
   payTimer = setTimeout(() => {
      clearTimeout(payTimer)
      if (isTimeout.value) return
      queryPayOrderApi({outTradeNo, orderIntegral, uId}).then(async (queryRes: any) => {
         console.log(queryRes.data)
         const { code, status } = queryRes.data
         if (code === '10000') {
            switch (status) {
               case 'TRADE_SUCCESS': noticeTxt.value = '支付成功！'
                  // 清除本地支付订单号的记录
                  uni.removeStorageSync('PAY_ORDE_NUM')
                  payStatus.value = true
                  // eslint-disable-next-line no-case-declarations
                  const selectRes = await tokenRequest('GET', '/api/user/userinfo', { uId })
                  updateUserInfo(selectRes.data)
                  setTime()
                  break
               default:
                  noticeTxt.value = '支付中...'
                  paymentListen()
                  break
            }
         } else {
            noticeTxt.value = '请扫描二维码完成支付'
            paymentListen()
         }
      })
   }, 1500)
}
// 判断支付是否超时
onMounted(() => {
   setTimeout(() => {
      if (!payStatus.value) {
         clearInterval(payTimer)
         noticeTxt.value = '支付超时，付款后请点击`已支付`按钮确认！'
         isTimeout.value = true
      }
   }, 1000 * 10)
})

const back = () => {
   clearInterval(payTimer)
   qrcodeUrl.value = null
   uni.reLaunch({ url: '/subpackage/integral' })
}

// 回到我的页面
const gotToPersnal = () => {
   uni.switchTab({ url: '/pages/personal/personal' })
}

// 倒计时
let countdownTimer = null
const setTime = () => {
   clearTimeout(countdownTimer)
   countdownTimer = setTimeout(() => {
      countdown.value -= 1
      if (countdown.value > 0) setTime()
      else {
         gotToPersnal()
      }
   }, 1000)
}


// 支付超时点击确认订单已支付按钮
const payConfirmBtn = () => {
   isTimeout.value = false
   paymentListen()
}
</script>

<template>
   <view class="payment-res">
      <view class="container">
         <view class="title">支付宝扫一扫，向我付款</view>
         <!-- 二维码 -->
         <view class="code-box">
            <QrCode :codeUrl="qrcodeUrl">
               <template #extend>
                  <!-- 支付超时 -->
                  <view v-if="isTimeout" class="code-msk">
                     <svg-icon icon="pay-err" :size="80" color="skyblue" />
                  </view>
                  <!-- 支付成功 -->
                  <view v-if="payStatus" class="code-msk">
                     <svg-icon icon="pay-ok" :size="80"/>
                  </view>
               </template>
            </QrCode>
            <view v-if="qrcodeUrl" class="text">{{ noticeTxt }}</view>
         </view>
         <!-- 订单编辑 -->
         <view class="edit">
            <text class="edit-amount">修改金额</text>
            <text class="line">|</text>
            <text class="save-code" @click="saveImgToAlbum(codeBase64)">保存图片</text>
         </view>
         <!-- 倒计时 -->
         <view v-if="payStatus" class="countdown"><text class="text">{{ countdown }}s</text> 后跳转页面</view>
         <!-- 订单信息 -->
         <view class="orde-info">
            <text>订单描述：积分充值</text>
            <text>充值积分：{{ params.order_integral }}</text>
            <view class="order-num">
               <view>订单号：
                  {{ params.out_trade_no }}<text class="copy-order-num" @click="copyOrderNum(params.out_trade_no)">复制</text>
               </view>
            </view>
            <text>下单时间：{{ params.order_time }}</text>
         </view>
         <view class="pay-record">
            <view>
               <svg-icon icon="record" :size="16" color="#444" />
               <text style="margin-left: 4rpx;">付款记录</text>
            </view>
            <svg-icon icon="arrow-r" :size="10" />
         </view>
      </view>
      <!-- 底部操作按钮 -->
      <view class="btns">
         <!-- 返回按钮 -->
         <view class="back" @click="back">
            <svg-icon icon="back" :size="15" color="#444" />
            <view>返回</view>
         </view>
         <!-- 支付超时确认支付按钮 -->
         <view>
            <button v-if="isTimeout" size="mini" type="primary" @click="payConfirmBtn">已支付</button>
         </view>
      </view>
   </view>
</template>

<style scoped lang="scss">
.payment-res {
   padding: 36rpx;
   box-sizing: border-box;
   background-color: #108FEA;
   display: flex;
   flex-direction: column;
   .container {
      position: relative;
      width: 100%;
      min-height: 940rpx;
      background-color: #fff;
      margin-top: 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28rpx;
      padding: 20rpx 20rpx 80rpx;
      box-sizing: border-box;

      .title {
         margin-bottom: 40rpx;
      }

      .code-box {
         min-width: 410rpx;
         min-height: 410rpx;
         display: flex;
         flex-direction: column;
         align-items: center;

         .text {
            margin: 20rpx auto;
         }

         .code-msk {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .6);
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
         }
      }

      .edit {
         color: #108FEA;

         .line {
            color: #ccc;
            font-size: 20rpx;
            margin: 0 40rpx;
         }
      }

      // 回到我的页面
      .countdown {
         margin-top: 40rpx;

         .text {
            color: red;
         }
      }
      .orde-info {
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: flex-start;
         margin-top: 40rpx;
         margin-left: 40rpx;
         box-sizing: border-box;
         line-height: 46rpx;
         .order-num {
            display: flex;
            word-break: break-all;
         }
         .copy-order-num {
            background-color: #108FEA;
            color: #fff;
            font-size: 20rpx;
            padding: 2rpx 4rpx;
            margin-left: 10rpx;
         }
      }
      .pay-record {
         position: absolute;
         bottom: 0;
         left: 0;
         width: 100%;
         padding: 20rpx;
         box-sizing: border-box;
         display: flex;
         align-items: center;
         justify-content: space-between;
      }
   }

   .btns {
      width: 100%;
      height: 100rpx;
      background-color: #fff;
      margin-top: 16rpx;
      font-size: 26rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20rpx;
      box-sizing: border-box;

      .back {
         display: flex;
      }
   }
}
</style>