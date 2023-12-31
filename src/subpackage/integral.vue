<script lang="ts" setup>
import { getUserInfoKeyVal } from '@/hooks/user'
import { createOrderApi } from '@/api/pay'
import { encryptData, formatTimestamp } from '@/utils'

const paymentOptions = [
   { value: '5', text: '100' },
   { value: '10', text: '220' },
   { value: '15', text: '350' },
   { value: '20', text: '500' },
   { value: '25', text: '700' },
   { value: '30', text: '1000' }
]
const totalAmount = ref<string>() // 订单金额
const orderIntegral = ref<number>() // 订单积分

/**
 * 去支付
 * @param amount [string] 支付金额
 * @param addIntegral [number] 充值的积分
 */
const toPay = (amount: string, addIntegral: number) => {
   totalAmount.value = amount
   orderIntegral.value = addIntegral
   uni.showModal({
      content: `总计：${amount}￥`,
      confirmText: '付款',
      success: (res: any) => {
         if (res.confirm) {
            createPayOrde()
         } else {
            totalAmount.value = null
            orderIntegral.value = null
         }
      }
   })
}

// 创建订单
const createPayOrde = () => {
   if (!totalAmount.value) return uni.showToast({ title: '金额错误', icon: 'none' })
   uni.showLoading({ title: '创建订单中' })
   const uId = Number(getUserInfoKeyVal('id'))
   const orderTime = (new Date()).getTime()
   createOrderApi({
      totalAmount: totalAmount.value,
      orderIntegral: orderIntegral.value,
      uId, orderTime
   }).then((res: any) => {
      const { alipay_trade_precreate_response: r } = res.data
      if (r.code === '10000') {
         const ordeInfo = {
            total_amount: totalAmount.value, // 总金额
            qr_code: r.qr_code, // 二维码
            out_trade_no: r.out_trade_no, // 订单号
            order_integral: orderIntegral.value, // 订单积分
            u_id: uId, // 用户ID
            order_time: formatTimestamp(orderTime) // 下单时间
         }
         uni.hideLoading()
         // 记录支付订单号，解决支付超时无法更新积分
         uni.setStorageSync('PAY_ORDE_NUM', encryptData({
            outTradeNo: r.out_trade_no, // 订单号
            tradeNo: r.trade_no, //商户号
            orderIntegral: orderIntegral.value, // 订单积分
            uId: uId // 当前账号的ID
         }))
         uni.navigateTo({
            url: `/subpackage/payment?ordeInfo=${JSON.stringify(ordeInfo)}`
         })
      } else {
         uni.hideLoading()
         uni.showToast({ title: '订单创建失败', icon: 'error' })
      }
   }).catch(res => {
      uni.hideLoading()
      console.log(res.data.msg)
   })
}

const back = () => {
   uni.switchTab({ url: '/pages/personal/personal' })
}
</script>
<!-- 积分获取页面 -->
<template>
   <view class="integral">
      <view class="back" @click="back">
         <svg-icon icon="arrow-l" :size="20" />
      </view>
      <!-- 充值获取 -->
      <view class="payment">
         <view class="title">充值获取</view>
         <view class="options">
            <view v-for="item of paymentOptions" :key="item.text" class="pay-item"
               :class="{ active: totalAmount === item.value }" @click="toPay(item.value, Number(item.text))">{{ item.text }}积分</view>
         </view>
      </view>
      <!-- 查看广告获取 -->
      <view class="advertisement">
         <view class="title">查看广告获取</view>
      </view>
   </view>
</template>

<style scoped lang="scss">
.integral {
   width: 100%;
   height: 100vh;
   overflow: hidden;
   background-color: #F8F8F8;
   padding: 40rpx 40rpx 0;
   box-sizing: border-box;

   // 返回按钮
   .back {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 40rpx;
   }

   // 标题
   .title {
      font-size: 48rpx;
      color: #000;
      margin-bottom: 30rpx;
   }

   .payment {
      width: 100%;

      .options {
         width: 100%;
         display: flex;
         flex-wrap: wrap;
         justify-content: space-between;

         .pay-item {
            width: 30%;
            height: 100rpx;
            line-height: 100rpx;
            text-align: center;
            border: 1rpx solid #2AAE65;
            border-radius: 8rpx;
            margin-bottom: 4%;
            font-size: 30rpx;

            &.active {
               background-color: #2AAE65;
               color: #fff;
            }
         }
      }
   }
}
</style>