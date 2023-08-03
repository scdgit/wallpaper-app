<script setup lang="ts">
import type { ImgType } from '@/type'
import { encryptData } from '@/utils'
import { initPreviewData } from '@/hooks/wallpaper'

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

<!-- index.vue的banner组件 -->
<template>
   <view class="swoper-box">
      <swiper class="swiper" :circular="circular" :autoplay="setAutoplay" @change="toggleCurrent">
         <swiper-item v-for="(item, index) of data" :key="index" class="grad-animation" @click="columnDetails(item)">
            <view class="swiper-item">
               <image :src="item.url" class="image" mode="widthFix" lazy-load/>
            </view>
         </swiper-item>
      </swiper>
      <view class="dots">
         <view v-for="(_, index) of data" :key="index" class="dot-item" :class="{ active: index === currentPoint }" />
      </view>
   </view>
</template>

<style lang="scss" scoped>
.swoper-box {
   position: relative;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   .swiper {
      width: 700rpx;
      height: 304rpx;
      .swiper-item {
         margin: 0 6rpx;
         overflow: hidden;
      }
      .image {
         width: 100%;
         height: 100%;
      }
   }

   .dots {
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