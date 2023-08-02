<script lang="ts" setup>
import { getWindowHeight } from '@/utils'
import { initWallpaper, initCollectBooks } from '@/hooks'

const windowHeight = ref<string>()

getWindowHeight().then((H: number) => {
   windowHeight.value = H + 50 + 'px'
})

// 回退
const back = () => {
   uni.switchTab({ url: '/pages/personal/personal' })
}

// 跳转页面
const goToDetail = (tag: 'wall' | 'novel' | 'comic') => {
   if (tag === 'wall') {
      if (initWallpaper().length <= 0) return uni.showToast({ title: '快去收藏吧', icon: 'none' })
   } else if (tag === 'novel') {
      if (initCollectBooks().length <= 0) return uni.showToast({ title: '快去收藏吧', icon: 'none' })
   }
   uni.navigateTo({ url: `/subpackage/favorite-detail?tag=${tag}` })
}
</script>

<!-- 收藏夹页面 -->
<template>
   <view class="set-up" :style="{ height: windowHeight }">
      <view class="back" @click="back">
         <svg-icon icon="arrow-l" :size="25" color="#999" />
      </view>
      <view class="title">收藏夹</view>
      <view class="container">
         <view class="item" @click="goToDetail('wall')">
            <text class="text">图片</text>
            <view class="right">
               <svg-icon icon="arrow-r" color="#999" :size="12" />
            </view>
         </view>
         <view class="item" @click="goToDetail('novel')">
            <text class="text">小说</text>
            <view class="right">
               <svg-icon icon="arrow-r" color="#999" :size="12" />
            </view>
         </view>
         <view class="item" @click="goToDetail('comic')">
            <text class="text">漫画</text>
            <view class="right">
               <svg-icon icon="arrow-r" color="#999" :size="12" />
            </view>
         </view>
      </view>
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
         box-sizing: border-box;
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