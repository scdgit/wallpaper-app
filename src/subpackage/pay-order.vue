<script lang="ts" setup>
import Back from '@/components/Back.vue'
import Title from '@/components/Title.vue'
import { getWindowHeight } from '@/utils'
import { tokenRequest } from '@/utils/request'
import { validateOrderNumber } from '@/utils/check'

const windowHeight = ref<string>()
const outTradeNo = ref<string>() // 异常订单输入框的val
const popupEle = ref() // 异常订单弹出层DOM

onLoad(() => {
   getWindowHeight().then((H: number) => {
      windowHeight.value = H + 50 + 'px'
   })
})

// 查看订单记录
const prevOrderRecord = () => {
   uni.navigateTo({ url: '/subpackage/order-list' })
}

// 更新输入框的内容
const updateInpVal = (val: string) => {
   outTradeNo.value = val.replace(/[\s\r\n]+/g, '')
}
// 提交异常订单到数据库
const submitErrOrder = () => {
   if (!validateOrderNumber(outTradeNo.value)) {
      return uni.showToast({ title: '订单号有误', icon: 'error' })
   }
   tokenRequest('POST', '/api/order/addErrOrder', { outTradeNo: outTradeNo.value }).then(res => {
      if (res.data.code === 0) {
         return uni.showToast({ title: res.data.msg, icon: 'error' })
      }
      popupEle.value.close()
      uni.showToast({ title: res.data.msg })
   }).catch(err => console.error(err))
}
// 打开异常订单输入框
const openPopupBox = () => {
   outTradeNo.value = ''
   popupEle.value.open()
}
// 关闭弹出层
const closePopupBox = () => {
   popupEle.value.close()
   outTradeNo.value = ''
}
// 长按复制剪切板内容
const handleLongPress = () => {
   // 获取剪切板中的内容
   uni.getClipboardData({
      success: (res) => {
         // 将剪切板中的内容设置为输入框的值
         outTradeNo.value = res.data
      }
   })
}
</script>

<!-- 支付订单列表 -->
<template>
   <view class="pay-order" :style="{ height: windowHeight }">
      <Back url="/pages/personal/personal" />
      <Title text="订单" />
      <view class="container">
         <view class="item" @click="prevOrderRecord">
            <view class="text">
               <text>订单记录</text>
            </view>
            <view class="right">
               <svg-icon icon="arrow-r" color="#999" :size="12" />
            </view>
         </view>
         <view class="item" @click="openPopupBox">
            <text class="text">申请异常订单</text>
            <view class="right">
               <svg-icon icon="arrow-r" color="#999" :size="12" />
            </view>
         </view>
      </view>
      <uni-popup ref="popupEle" type="center">
         <view class="err-order-box">
            <uni-easyinput :value="outTradeNo" type="text" placeholder="请输入订单号" autoHeight @input="updateInpVal" @longpress="handleLongPress" />
            <view class="btns">
               <button class="confirm" type="primary" size="mini" @click="submitErrOrder">确定</button>
               <button class="cancel" type="warn" size="mini" @click="closePopupBox">取消</button>
            </view>
         </view>
      </uni-popup>
   </view>
</template>

<style scoped lang="scss">
.pay-order {
   background-color: #F8F8F8;
   overflow-x: hidden;
   padding: 128rpx 40rpx 0;
   box-sizing: border-box;

   .container {
      margin-top: 40rpx;
      background-color: #fff;
      border-radius: 8rpx;
      overflow-x: hidden;

      .item {
         position: relative;
         display: flex;
         justify-content: space-between;
         color: #595959;
         padding: 30rpx 40rpx;

         &:active {
            background-color: #efefef;
         }

         .right {
            display: flex;
            align-items: center;
            color: #999;

            .size {
               font-size: 24rpx;
               margin-right: 10rpx;
            }
         }
      }
   }

   .exit {
      position: fixed;
      bottom: 100rpx;
      left: 50%;
      width: 670rpx;
      height: 88rpx;
      text-align: center;
      line-height: 88rpx;
      transform: translateX(-50%);
      background-color: #FF6B03;
      color: #fff;
      border-radius: 8rpx;

      &:active {
         background-color: #da6008;
      }
   }

   .err-order-box {
      width: 720rpx;
      padding: 70rpx 40rpx 20rpx;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 6rpx;

      .btns {
         width: 100%;
         margin-top: 40rpx;
         text-align: right;

         .confirm {
            margin-right: 30rpx;
         }
      }
   }
}
</style>