<template>
   <view class="swoper-box">
      <swiper class="swiper grad-animation" :circular="circular" :autoplay="setAutoplay" @change="toggleCurrent">
         <swiper-item v-for="(item, index) of data" :key="index" @click="columnDetails(item)">
            <view class="swiper-item uni-bg-red">
               <image :src="item.url" class="image" mode="widthFix" lazy-load/>
            </view>
         </swiper-item>
      </swiper>
      <view class="dots">
         <view v-for="(_, index) of data" :key="index" class="dot-item" :class="{ active: index === currentPoint }" />
      </view>
   </view>
</template>
<script setup lang="ts">
import type { ImgType } from '@/type'
import { encryptData } from '@/utils'
import { initPreviewData } from '@/hooks'

const props = defineProps({
   data: {
      type: Array<ImgType>,
      default: []
   },
   livekeep: { // 跳转路由时是否保留当前页面
      type: Boolean,
      default: true
   },
   circular: {
      type: Boolean,
      default: true
   },
   autoplay: {
      type: Boolean,
      default: false
   }
})

let _play = ref<boolean>(props.autoplay)
// 设置播放
const setAutoplay = computed(() => {
   return _play.value
})
watch(() => props.autoplay, (nval: boolean) => {
   _play.value = nval
})

// 轮播图的点
let currentPoint = ref<number>(0)
const toggleCurrent = (e: any) => {
   currentPoint.value = e.detail.current
}
// 预览图片
const columnDetails = (img: ImgType) => {
   let pre_path: string
   const pages = getCurrentPages()
   if (!props.livekeep) pre_path = '/' + pages[pages.length - 1].route
   initPreviewData(props.data)
   uni.navigateTo({
      url: `/subpackage/wallpaper?img=${encryptData(img)}&pre_path=${pre_path}`
   })
}
</script>

<style lang="scss" scoped>
.swoper-box {
   position: relative;

   .swiper {
      width: 690rpx;
      height: 304rpx;
      margin: 0 auto;

      .image {
         width: 100%;
         height: 100%;
      }
   }

   .dots {
      position: absolute;
      bottom: -18rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      margin-top: 18rpx;
      display: flex;

      .dot-item {
         height: 4rpx;
         width: 40rpx;
         margin: 0 4rpx;
         background-color: #d8d2d2;
      }

      .active {
         background-color: #ED512D;
      }
   }
}
</style>