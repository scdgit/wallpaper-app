<template>
   <view class="container">
      <view class="nav-heiader">
         <view class="title">新闻</view>
         <view class="icons">
            <uni-icons type="search" size="40rpx" />
            <uni-icons type="notification" size="40rpx" />
         </view>
      </view>
      <!-- 轮播图 -->
      <Banner :data="banner" :autoplay="setAutoplay"/>
      <!-- 分类栏 -->
      <view class="classification">
         <view v-for="item of [1, 2, 3, 4, 5]" :key="item" class="item">
            <uni-icons type="images" size="60rpx" class="icon" />
            <text class="text">自制神剧</text>
         </view>
      </view>
      <!-- 通知栏 -->
      <uni-notice-bar show-icon scrollable class="notice" :text="noticeText" />
      <!-- 主体内容区域 -->
      <view class="column-container">
         <view class="column1">
            <view class="column-title">
               <uni-section title="热门资质" type="line">
                  <template #right>
                     <text class="text">查看更多</text>
                     <uni-icons type="forward" size="24rpx" color="#A5A5A5"/>
                  </template>
               </uni-section>
            </view>
            <view class="column-content">
               <view class="image-box">
                  <image src="@static/column1.png" class="image" mode="widthFix"/>
               </view>
               <view class="image-box">
                  <image src="@static/column1.png" class="image" mode="widthFix"/>
               </view>
            </view>
         </view>
         <view class="conlum2">
            <view class="column-title">
               <uni-section title="代办推荐" type="line">
                  <template #right>
                     <text class="text">查看更多</text>
                     <uni-icons type="forward" size="24rpx" color="#A5A5A5"/>
                  </template>
               </uni-section>
            </view>
            <view class="column-content">
               <view class="image-box">
                  <image src="@static/column2.png" class="image" mode="widthFix"/>
               </view>
            </view>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import type { BannerType, ColumnType } from '@/type'
import { decryptData } from '@/utils'

let banner = ref<Array<BannerType>>() // 轮播图数据
let autoplay = ref<boolean>(true)
let noticeText = 'uni-app 版正式发布，开发一次，同时发布iOS、Android、H5、微信小程序、支付宝小程序、百度小程序、头条小程序等7大平台。'

//#ifdef MP-WEIXIN
uni.showShareMenu()
//#endif

onLoad(() => {
   uni.hideLoading()
   banner.value = uni.getStorageSync('DATABASE').banner
})

onPageScroll(({scrollTop}) => {
   if (scrollTop >= 202) {
      // 停止轮播图的播放
      autoplay.value = false
   } else {
      autoplay.value = true
   }
})
const setAutoplay = computed(() => {
   return autoplay.value
})
</script>

<style scoped lang="scss">
.container {
   padding-bottom: 2rpx;
   background-color: var(--bg-color);
   padding: 0 30rpx;
   box-sizing: border-box;

   // 顶部导航
   .nav-heiader {
      height: 56rpx;
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
      line-height: 56rpx;
      // margin-top: 98rpx;
      margin-bottom: 40rpx;

      .uni-icons {
         margin-left: 20rpx;
      }
   }

   // 分类栏
   .classification {
      width: 690rpx;
      display: flex;
      justify-content: space-between;
      margin-top: 70rpx;

      .item {
         // width: 10.67%;
         // height: 4.08%;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;

         .text {
            font-size: 20rpx !important;
            margin-top: 16rpx;
            color: #666666;
         }
      }
   }

   // 通知栏
   .notice {
      height: 60rpx;
      width: 690rpx;
      border-radius: 26rpx;
      background-color: #F5F5F5 !important;
      margin: 56rpx 0 48rpx;

      ::v-deep .uni-icons {
         color: #FB5542 !important;
      }

      ::v-deep .uni-noticebar__content-text {
         color: #999 !important;
      }
   }

   ::v-deep .column-container,
   ::v-deep .uni-section-header {
      padding: 0 !important;
   }

   // 主体内容区域
   .column-container {
      width: 100%;
      .column-title {
         height: 50rpx;
         line-height: 50rpx;
         margin-bottom: 30rpx;
         ::v-deep .line {
            background-color: #FF6D19;
         }
         ::v-deep .uni-section__content-title {
            font-size: 36rpx;
            color: #303133 !important;
         }
         .text {
            color: #A5A5A5;
            font-size: 24rpx;
         }
      }
      .image {
         width: 100%;
         height: 100%;
         line-height: 0;
      }
      .column1 {
         width: 100%;
         margin-bottom: 48rpx;
         .column-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .image-box {
               width: 336rpx;
            }
         }
      }
      .column2 {
         width: 100%;
         margin-bottom: 48rpx;
         .column-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .image-box {
               width: 100%;
               height: 158px;
            }
         }
      }
   }


}</style>
