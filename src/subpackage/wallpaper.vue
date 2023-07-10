<template>
   <div class="wallpaper">
      <!-- 图片预览 -->
      <view v-if="img" class="preview">
         <MyImage :src="img && img.url" mode="widthFix" @load="imgLoad" />
      </view>
      <!-- 视频预览 -->
      <view v-if="video" class="video">
         <MyVideo :video="video" />
      </view>
      <view class="tool">
         <view class="tool-item" @click="goBack">
            <uni-icons type="arrow-left" /><!-- 返回 -->
         </view>
         <view class="tool-item" @click="toCollect">
            <uni-icons :type="!isCollect ? `star` : `star-filled`" /><!-- 收藏 -->
         </view>
         <view class="tool-item">
            <uni-icons type="download" @click="toDownload(img)" /><!-- 下载 -->
         </view>
         <!-- 分享 -->
         <view v-if="deviceType === 'app'" class="tool-item" @click="shareByApp">
            <uni-icons type="redo" />
         </view>
         <view v-else-if="deviceType === 'web'" class="tool-item" @click="shareWeb">
            <uni-icons type="redo" />
         </view>
         <label v-else class="tool-item" for="share-btn">
            <uni-icons type="redo" />
         </label>
      </view>
      <button id="share-btn" open-type="share" style="display: none;" />
   </div>   
</template>

<script setup lang="ts">
import MyImage from '@/components/MyImage.vue'
import MyVideo from '@/components/MyVideo.vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { HOST } from '@/config'
import type { ImgType } from '@/type'
import { decryptData, saveImgToAlbum } from '@/utils'
import { useFavorites, updateFavorites } from '@/hooks'

let img = ref<ImgType>() // 图片对象
let deviceType = ref<string>('') // 当前设备类型
let isCollect = ref<boolean>(false) // 是否收藏
let pre_path = ref<string>('') // 跳转前的页面
let video: any = ref<object>({}) // 视频链接

onLoad((options: any) => {
   // uni.showLoading({ title: '加载中...' })
   img.value = options.img ? decryptData(options.img): null
   pre_path.value = options.pre_path
   deviceType.value = uni.getStorageSync('deviceType')
   // 视频链接
   video.value = options.video ? JSON.parse(options.video): null
   // 判断是否已收藏
   useFavorites.forEach((element: ImgType) => {
      if (element.file === img.value.file) return isCollect.value = true
   });
})

// 图片加载
const imgLoad = () => {
   uni.hideLoading()
}
// 返回按钮
const goBack = () => {
   uni.hideLoading()
   if (pre_path.value == 'undefined' || !pre_path.value) {
      const page = getCurrentPages()
      if (page.length > 1) uni.navigateBack({ delta: 2 })
      else uni.switchTab({ url: '/pages/index/index' })
   } else {
      uni.redirectTo({ url: pre_path.value })
   }
}

// 非app生效的分享功能
onShareAppMessage(() => {
   return {
      desc: '点击查看更多精美壁纸',
      path: `/subpackage/wallpaper?url=${img.value.url}`
   }
})
// app端分享功能
const shareByApp = () => {
   uni.showLoading({ title: '开启中...' })
   const pages = getCurrentPages();
   const currentPage = pages[pages.length - 1]['$page'].fullPath
   plus.share.sendWithSystem({
      content: '色彩墙',
      href: `${HOST}${currentPage}`
   }, () => {
      uni.hideLoading()
   }, () => { uni.hideLoading() })
}
// H5端分享
const shareWeb = () => {
   if (navigator.share) {
      navigator.share({
         title: '嘀嘀，你还等什么',
         url: window.location.href
      })
   } else {
      uni.setClipboardData({
         data: window.location.href,
         showToast: true,
         fail: () => {
            uni.showToast({ title: '复制失败' })
         }
      })
   }
}

// 点击收藏
let flag1 = false // 节流阀
const toCollect = () => {
   if (flag1) return
   let msg: string
   flag1 = true
   if (!isCollect.value) { // 点击收藏
      updateFavorites('add', img.value)
      msg = '已收藏'
   } else { // 取消收藏
      updateFavorites('del', img.value)
      msg = '取消了收藏'
   }
   isCollect.value = !isCollect.value
   setTimeout(() => {
      flag1 = false
      uni.showToast({ title: msg, icon: 'none' })
      // 刷新收藏夹
   }, 300)
}

// 点击下载
const toDownload = async (img: ImgType) => {
   saveImgToAlbum(img.url)
}
</script>

<style scoped lang="scss">
.wallpaper {
   width: 100%;
   min-height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: #fff;
   background-size: 100%;
   background-repeat: repeat-y;
   background-position: left top;

   .preview, .video {
      width: 100%;
      height: 100vh;
      line-height: 0;
   }

   // 工具栏
   .tool {
      position: fixed;
      z-index: 99;
      bottom: 30rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      line-height: 90rpx;
      background-color: #000;
      color: #fff;
      display: flex;
      justify-content: space-around;
      border-radius: 60rpx;

      .tool-item {
         display: flex;
         flex-direction: column;
         color: #fff;
         font-size: 24rpx;

         ::v-deep .uni-icons {
            font-size: 46rpx !important;
            color: rgba(255, 255, 255, .9) !important;
         }
      }
   }
}
</style>