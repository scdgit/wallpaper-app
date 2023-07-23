<script lang="ts" setup>
const paymentOptions = [
   { value: '5', text: '100' },
   { value: '10', text: '220' },
   { value: '15', text: '350' },
   { value: '20', text: '500' },
   { value: '25', text: '700' },
   { value: '30', text: '1000' }
]
const totalAmount = ref<string>() // 总金额
// 去支付
const toPay = (amount: string) => {
   totalAmount.value = amount
   uni.showModal({
      content: `总计：${amount}￥`,
      confirmText: '付款',
      success: (res: any) => {
         if (res.confirm) {
            createPayOrde()
         } else {
            totalAmount.value = null
         }
      }
   })
}

// 创建订单
const createPayOrde = () => {
   if (!totalAmount.value) return uni.showToast({ title: '金额错误', icon: 'none' })
   uni.showLoading({ title: '创建订单中' })
   uni.request({
      url: '/api/payment/inPerson',
      method: 'POST',
      data: {
         totalAmount: totalAmount.value
      },
      success: (res: any) => {
         const { alipay_trade_precreate_response: r } = res.data
         if (r.code === '10000') {
            const ordeInfo = {
               total_amount: totalAmount.value,
               qr_code: r.qr_code,
               out_trade_no: r.out_trade_no,
               trade_no: r.trade_no
            }
            uni.hideLoading()
            uni.navigateTo({
               url: `/subpackage/payment?ordeInfo=${JSON.stringify(ordeInfo)}`
            })
         } else {
            uni.showToast({ title: '订单创建失败', icon: 'error' })
         }
      }
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
               :class="{ active: totalAmount === item.value }" @click="toPay(item.value)">{{ item.text }}积分</view>
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