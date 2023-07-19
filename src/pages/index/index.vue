<template>
   <view class="container">
      <!-- 头部 -->
      <view class="nav-heiader">
         <view class="title">新闻</view>
         <view class="icons">
            <uni-icons type="search" size="40rpx" />
            <uni-icons type="notification" size="40rpx" />
         </view>
      </view>
      <!-- 轮播图 -->
      <Banner :data="banner" :autoplay="setAutoplay" />
      <!-- 分类栏 -->
      <view class="classification">
         <view v-for="(item, index) of expansionApis" :key="index" class="item" @click="callApi(item)">
            <view class="image">
               <img :src="`${BASE_URL}/${item.icon}`" style="height:100%;" />
            </view>
            <text class="text">{{ item.title }}</text>
         </view>
      </view>
      <!-- 随机文本弹出层 -->
      <uni-popup ref="popup" type="center">
         <view class="random-text">
            <text>{{ randomText }}</text>
            <uni-icons class="exit-icon" type="close" size="22" @click="exitTextBox"></uni-icons>
         </view>
      </uni-popup>
      <!-- 通知栏 -->
      <uni-notice-bar show-icon scrollable class="notice" :text="noticeText" />
      <!-- 主体内容区域 -->
      <view class="column-container">
         <view class="column1">
            <view class="column-title">
               <uni-section title="热门小说" type="line">
                  <template #right>
                     <text class="text" @click="goToNovelPage">查看更多</text>
                     <uni-icons type="forward" size="24rpx" color="#A5A5A5" />
                  </template>
               </uni-section>
            </view>
            <view class="column-content">
               <view class="image-box">
                  <image src="@static/column1.png" class="image" mode="widthFix" />
               </view>
               <view class="image-box">
                  <image src="@static/column1.png" class="image" mode="widthFix" />
               </view>
            </view>
         </view>
         <view class="conlum2">
            <view class="column-title">
               <uni-section title="代办推荐" type="line">
                  <template #right>
                     <text class="text">查看更多</text>
                     <uni-icons type="forward" size="24rpx" color="#A5A5A5" />
                  </template>
               </uni-section>
            </view>
            <view class="column-content">
               <view class="image-box">
                  <image src="@static/column2.png" class="image" mode="widthFix" />
               </view>
            </view>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import type { ImgType, ExpansionApisType } from '@/type'
import { decryptData, targetObjData } from '@/utils'
import { useDeviceType, goToPreview } from '@/hooks'
import { BASE_URL } from '@/config'

let banner = ref<Array<ImgType>>() // 轮播图数据
let autoplay = ref<boolean>(true)
let noticeText = '我的页面-完成预览任务-充值中心充值-获得更多积分-每日登陆可免费领取2点积分'
let expansionApis: Array<ExpansionApisType> = uni.getStorageSync('EXPANSIONAPI')
const popup = ref(null) // 随机文案弹出层
let randomText = ref<string>() // 随机文案

//#ifdef MP-WEIXIN
uni.showShareMenu()
//#endif

onLoad(() => {
   uni.hideLoading()
   banner.value = uni.getStorageSync('DATABASE').banner
})

onPageScroll(({ scrollTop }) => {
   if (scrollTop >= 202) {
      // 停止轮播图的播放
      autoplay.value = false
   } else {
      autoplay.value = true
   }
})
// 设置自动播放
const setAutoplay = computed(() => {
   return autoplay.value
})

// 调用扩展接口
const callApi = (expansionApi: ExpansionApisType) => {
   uni.showLoading({ title: '生成中...' })
   const base = useDeviceType === 'web' ? expansionApi.proxy : expansionApi.host
   const method = expansionApi.method ? expansionApi.method : 'GET'
   uni.request({
      url: base + expansionApi.api,
      method: method,
      success: (res: any) => {
         uni.hideLoading()
         const target: string = targetObjData(res.data, expansionApi.target)
         if ((/\.(png|jpe?g|gif)$/i).test(target)) {
            const img: ImgType = {
               file: '', describe: '', tag: '', ratio: 0,
               url: target
            }
            goToPreview([img], img)
         } else {
            randomText.value = target
            // 弹出随机文案
            popup.value.open()
         }
      },
      fail: (err) => {
         uni.hideLoading()
         uni.showToast({ title: '生成失败...' })
         console.error('发生了未知错误:' + JSON.stringify(err))
      }
   })
}
// 退出随机文本弹出框
const exitTextBox = () => {
   popup.value.close()
}

// 进入小说列表页面
const goToNovelPage = () => {
   uni.navigateTo({
      url: '/pages/novel/novel'
   })
}
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
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         .image {
            height: 30px;
         }
         .text {
            font-size: 20rpx !important;
            margin-top: 16rpx;
            color: #666666;
         }
      }
   }

   // 弹出层
   .random-text {
      width: 300px;
      min-height: 100px;
      margin: 0 auto;
      font-size: 24rpx;
      line-height: 36rpx;
      background-color: #fff;
      padding: 20rpx 20rpx 40rpx;
      box-sizing: border-box;
      position: relative;
      border-radius: 8rpx;
      text-align: justify;
      .exit-icon {
         position: absolute;
         z-index: 999;
         right: 10rpx;
         bottom: 6rpx;
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


}
</style>
