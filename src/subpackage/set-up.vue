<script lang="ts" setup>
import { getWindowHeight } from '@/utils'
import { clearUserData } from '@/utils/user'

const windowHeight = ref<string>()
const storeageSize = ref(uni.getStorageInfoSync().currentSize)

getWindowHeight().then((H: number) => {
   windowHeight.value = H + 'px'
})

const setSize = computed(() => {
   return (storeageSize.value / 1024).toFixed(3) + 'M'
})

// 回退
const back = () => {
   uni.switchTab({ url: '/pages/personal/personal' })
}

// 清除数据
const loginOut = () => {
   uni.showModal({
      content: '是否清除所有数据？',
      success({ confirm }) {
         if (confirm) {
            clearUserData()
            uni.showToast({ title: '清除成功' })
            uni.navigateTo({ url: '/pages/loading/loading' })
         }
      },
   })
}

// 退出登陆
const doExit = () => {
   uni.showModal({
      content: '是否退出登陆',
      success({ confirm }) {
         if (confirm) {
            uni.removeStorageSync('USER_INFO')
            uni.removeStorageSync('TOKEN')
            uni.reLaunch({ url: '/subpackage/login-user' })
         }
      },
   })
}
</script>

<!-- 个人中心的设置页面 -->

<template>
   <view class="set-up" :style="{ height: windowHeight }">
      <view class="back" @click="back">
         <svg-icon icon="arrow-l" :size="25" color="#999" />
      </view>
      <view class="title">设置</view>
      <view class="container">
         <view class="item m-b-20" @click="loginOut">
            <text class="text">清除用户数据</text>
            <view class="right">
               <text class="size" style="color:rgb(75, 175, 214)">{{ setSize }}</text>
               <svg-icon icon="arrow-r" color="#999" :size="12" />
            </view>
         </view>
         <view class="item">
            <text class="text">上限存储空间</text>
            <view class="right">
               <text class="size" style="color:red">10M</text>
            </view>
         </view>
      </view>
      <view class="exit" @click="doExit">退出登陆</view>
   </view>
</template>

<style scoped lang="scss">
.set-up {
   background-color: #F8F8F8;
   overflow: hidden;
   padding: 40rpx;
   box-sizing: border-box;

   .back {
      margin-bottom: 48rpx;
      margin-left: -1.5%;
   }

   .title {
      font-size: 40rpx;
      line-height: 68rpx;
      color: #333;
   }

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
}</style>