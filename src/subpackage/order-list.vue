<script lang="ts" setup>
import Back from '@/components/Back.vue'
import Title from '@/components/Title.vue'
import { getWindowHeight, formatTimestamp, checkDate, copyOrderNum } from '@/utils'
import { getUserInfoKeyVal } from '@/hooks/user'
import type { payOrderType } from '@/type'
import { tokenRequest } from '@/utils/request'

const windowHeight = ref<string>()
const orderList = ref<Array<payOrderType>>([])
const popupEle1 = ref() // 查看订单弹出层DOM
const activeOrder = ref<payOrderType>() // 点开的订单

onLoad(async () => {
   getWindowHeight().then((H: number) => {
      windowHeight.value = H + 50 + 'px'
   })
   try {
      uni.showLoading()
      // 获取用户订单列表
      const selectRes = await tokenRequest('POST', '/api/order/userOrder', { uId: getUserInfoKeyVal('id') })
      orderList.value = selectRes.data.orders
      uni.hideLoading()
   } catch (err) {
      console.error(err)
      uni.hideLoading()
   }
})

// 打开查看订单
const openOrder = (order: payOrderType) => {
   popupEle1.value.open()
   activeOrder.value = order
}
// 关闭查看订单弹出层
const closeOrder = () => {
   popupEle1.value.close()
}
</script>

<!-- 订单列表 -->
<template>
   <div class="order-list" :style="{ height: windowHeight }">
      <Back url="/subpackage/pay-order" />
      <Title text="支付记录" />
      <view class="list">
         <view v-for="(order, index) of orderList" :key="index" class="item" @click="openOrder(order)">
            <svg-icon icon="shop" :size="24" color="#10A6E2" />
            <view class="desc">
               <view class="line-1">
                  <text>积分充值</text>
                  <text v-if="order.status === 1">-{{ order.totalAmount }}</text>
                  <text v-else>-0</text>
               </view>
               <view v-if="order.status === 1" class="line-2">完成 √</view>
               <view v-else class="line-2">未支付 ×</view>
               <view class="line-3">
                  <text v-if="checkDate(order.orderTime) !== `其他日期`" class="txt1">{{ checkDate(order.orderTime) }}</text>
                  <text class="txt2">{{ formatTimestamp(order.orderTime) }}</text>
               </view>
            </view>
         </view>
      </view>
      <!-- 查看订单弹出框 -->
      <uni-popup ref="popupEle1" type="center">
         <view class="open-order">
            <view class="open-item">
               <text class="title">订单描述：</text>
               积分充值
            </view>
            <view class="open-item">
               <text class="title">金额：</text>
               {{ activeOrder.totalAmount }}.00￥
            </view>
            <view class="open-item order-num">
               <text class="title">订单号：</text>
               <view class="num-right">
                  <text>{{ activeOrder.outTradeNo }}</text>
                  <text class="copy" @click="copyOrderNum(activeOrder.outTradeNo)">复制</text>
               </view>
            </view>
            <view class="open-item">
               <text class="title">时间：</text>
               {{ formatTimestamp(activeOrder.orderTime) }}
            </view>
            <view class="open-item">
               <text class="title">状态：</text>
               {{ activeOrder.status === 1 ? '已支付':'未支付' }}
            </view>
            <view class="close-btn">
               <svg-icon icon="close" :size="20" color="#666" @click="closeOrder" />
            </view>
         </view>
      </uni-popup>
   </div>
</template>

<style scoped lang="scss">
.order-list {
   background-color: #F8F8F8;
   overflow-x: hidden;
   padding: 128rpx 40rpx 0;
   box-sizing: border-box;

   .list {
      .item {
         display: flex;
         justify-content: space-between;
         margin-bottom: 10rpx;
         padding: 10rpx 20rpx;
         background-color: #fff;
         border-radius: 8rpx;

         .img-box {
            width: 60rpx;
            height: 60rpx;

            .img {
               width: 100%;
               height: 100%;
            }
         }

         .desc {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #666;
            font-size: 20rpx;
            margin-left: 10rpx;

            .line-1 {
               color: #000;
               font-size: 28rpx;
               display: flex;
               justify-content: space-between;
            }

            .line-2 {
               margin: 10rpx 0;
            }

            .line-3 {
               .txt1 {
                  margin-right: 20rpx;
               }
            }
         }
      }
   }

   .open-order {
      width: 320px;
      position: relative;
      background-color: #fff;
      font-size: 26rpx;
      border-radius: 4rpx;
      box-sizing: border-box;

      .open-item {
         padding: 8rpx;
         .title {
            font-size: 24rpx;
         }
      }

      .order-num {
         display: flex;

         .num-right {
            flex: 1;
            word-break: break-all;
            .copy {
               background-color: #108FEA;
               color: #fff;
               font-size: 20rpx;
               padding: 2rpx 4rpx;
               margin-left: 20rpx;
            }
         }
      }

      .close-btn {
         position: absolute;
         top: 10rpx;
         right: 10rpx;
      }
   }
}</style>