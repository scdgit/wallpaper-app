<template>
   <view class="container">
      <view class="favorites">
         <WaterFallFlow :data="useFavorites" :column="2" :space="4" :livekeep="false"/>
      </view>
      <view class="back" @click="goBack">
         <uni-icons type="arrow-left" size="30" color="skyblue" />&nbsp;返回
      </view>
   </view>
</template>

<!-- 收藏夹页面-分包 -->
<script lang="ts" setup>
import WaterFallFlow from '@/components/waterfall-flow.vue'
import { useFavorites, initFavorite } from '@/hooks'

onLoad(() => {
   initFavorite()
})

// 返回上一级
const goBack = () => {
   uni.switchTab({url: '/pages/personal/personal'})
}
</script>

<style scoped lang="scss">
/* #ifdef H5 */
::v-deep uni-page-head {
   display: block !important;
}
::v-deep .uni-page-head-hd {
   display: none !important;
}
/* #endif */
.container {
   width: 100%;
   background-color: #fff;
   display: flex;
   align-items: center;
   justify-content: center;
   .favorites {
      width: 90%;
      padding: 30rpx 20rpx;
      box-sizing: border-box;
   }
   .back {
      padding: 6rpx 20rpx;
      color: skyblue;
      position: fixed;
      bottom: 40rpx;
      right: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20rpx;
      box-shadow: 0 0 16rpx 4rpx skyblue;
   }
}
</style>