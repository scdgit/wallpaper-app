<script lang="ts" setup>
import QrCode from '@/components/QrCode.vue'
import { queryPayOrder } from '@/api'
import { saveImgToAlbum } from '@/utils'

const qrcodeUrl = ref<string>(null)  // 支付二维码链接
const noticeTxt = ref<string>() // 提示文本
const countdown = ref<number>(5) // 倒计时
const payStatus = ref<boolean>(false) // 支付状态
let payTimer = null
let outTradeNo: string // 支付的订单号
let tradeNo: string // 商户号
let totalAmount: string
let isTimeout = ref<boolean>(false) // 是否超时
let codeBase64 = ref<string>() // 二维码

onLoad((options) => {
   const { total_amount, out_trade_no, trade_no, qr_code } = JSON.parse(options.ordeInfo) || {}
   totalAmount = total_amount
   outTradeNo = out_trade_no
   tradeNo = trade_no
   qrcodeUrl.value = qr_code
   paymentListen()
})

// 判断支付是否完成
const paymentListen = () => {
   if (payStatus.value) return noticeTxt.value = '该订单已完成'
   payTimer = setTimeout(() => {
      clearInterval(payTimer)
      if (isTimeout.value) return
      queryPayOrder(outTradeNo, tradeNo).then((queryRes: any) => {
         console.log(queryRes.data)
         const { code, status } = queryRes.data
         if (code === '10000') {
            switch (status) {
               case 'TRADE_SUCCESS': noticeTxt.value = '支付成功！'
                  payStatus.value = true
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
         noticeTxt.value = '支付超时，请刷新二维码重新保存支付！'
         isTimeout.value = true
      }
   }, 1000 * 45)
})

const back = () => {
   clearInterval(payTimer)
   qrcodeUrl.value = null
   uni.reLaunch({ url: '/subpackage/integral' })
}

// 刷新二维码
const doRefresh = () => {
   const ordeInfo = {
      total_amount: totalAmount,
      qr_code: qrcodeUrl.value,
      out_trade_no: outTradeNo,
      trade_no: tradeNo
   }
   uni.reLaunch({ url: `/subpackage/payment?ordeInfo=${JSON.stringify(ordeInfo)}` })
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
</script>

<template>
   <view class="payment-res">
      <view class="container">
         <view class="title">支付宝扫一扫，向我付款</view>
         <!-- 订单信息 -->
         <view class="orde-info">

         </view>
         <!-- 二维码 -->
         <view class="code-box">
            <QrCode :codeUrl="qrcodeUrl">
               <template v-if="isTimeout" #extend>
                  <view class="code-msk" @click="doRefresh">
                     <svg-icon icon="refresh" :size="80" color="skyblue" />
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
         <!-- 刷新二维码 -->
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
         <view class="back" @click="back">
            <svg-icon icon="back" :size="15" color="#444" />
            <view>返回</view>
         </view>
      </view>
   </view>
</template>

<style scoped lang="scss">
.payment-res {
   height: 100vh;
   padding: 36rpx;
   box-sizing: border-box;
   background-color: #108FEA;
   display: flex;
   flex-direction: column;

   .container {
      position: relative;
      width: 100%;
      min-height: 800rpx;
      background-color: #fff;
      margin-top: 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28rpx;
      padding: 20rpx;
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