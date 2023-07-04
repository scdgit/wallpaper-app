<template>
   <div class="wallpaper">
      <!-- 图片预览 -->
      <view class="preview">
         <MyImage :src="img && img.url" mode="widthFix" @load="imgLoad" />
      </view>
      <view class="tool">
         <view class="tool-item" @click="goBack">
            <uni-icons type="arrow-left"/><!-- 返回 -->
         </view>
         <view class="tool-item" @click="toCollect">
            <uni-icons :type="!isCollect?`star`:`star-filled`"/><!-- 收藏 -->
         </view>
         <view class="tool-item">
            <uni-icons type="download" @click="toDownload(img)"/><!-- 下载 -->
         </view>
         <!-- 分享 -->
         <view v-if="deviceType === 'app'" class="tool-item" @click="shareByApp">
            <uni-icons type="redo"/>
         </view>
         <view v-else-if="deviceType === 'web'" class="tool-item" @click="shareWeb">
            <uni-icons type="redo"/>
         </view>
         <label v-else class="tool-item" for="share-btn">
            <uni-icons type="redo"/>
         </label>
      </view>
      <button id="share-btn" open-type="share" style="display: none;" />
   </div>
</template>

<script setup lang="ts">
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import MyImage from '@/components/MyImage.vue'
import { HOST } from '@/config'
import type { ImgType } from '@/type'
import { encryptData, decryptData } from '@/utils'

let img = ref<ImgType>() // 图片对象
let deviceType = ref<string>('') // 当前设备类型
let isCollect = ref<boolean>(false) // 是否收藏

onLoad((options: any) => {
   uni.showLoading({ title: '加载中...' })
   img.value = (decryptData(options.img))
   deviceType.value = uni.getStorageSync('deviceType')
   // 判断是否已收藏
   let favorites = uni.getStorageSync('favorites') ? decryptData(uni.getStorageSync('favorites')) : []
   favorites.forEach((element: ImgType) => {
      if (element.file === img.value.file) return isCollect.value = true
   });
})

// 图片加载
const imgLoad = () => {
   setTimeout(() => {
      uni.hideLoading()
   }, 200)
}
// 返回按钮
const goBack = () => {
   uni.navigateBack({
      delta: 2,
      fail: () => {
         uni.switchTab({ url: '/pages/index/index' })
      }
   })
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
let flag = false // 节流阀
const toCollect = () => {
   if (flag) return
   let favorites = [], msg:string
   flag = true
   favorites = uni.getStorageSync('favorites') ? decryptData(uni.getStorageSync('favorites')) : []
   if (!isCollect.value) { // 点击收藏
      favorites.push(img.value)
      msg = '已收藏'
   } else { // 取消收藏
      favorites.forEach((item, index) => {
         if (item.url === img.value.url) return favorites.splice(index, 1)
      })
      msg = '取消了收藏'
   }
   isCollect.value = !isCollect.value
   if (favorites.length === 0) {
      uni.removeStorage({key:'favorites'})
   } else {
      uni.setStorageSync('favorites', encryptData(favorites))
   }
   setTimeout(() => {
      flag = false
      uni.showToast({title: msg, icon: 'none'})
   }, 300)
}

// 点击下载
const toDownload = (img: ImgType) => {
   uni.saveFile({
      tempFilePath: img.url,
      success: () => {
         uni.showToast({title: '已保存到设备中'})
      },
      fail: () => {
         uni.showToast({title: '保存失败', icon: 'error'})
      }
   })
}
</script>

<style scoped lang="scss">

.wallpaper {
   width: 100%;
   min-height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;

   .preview {
      width: 95%;
      line-height: 0;
   }

   // 工具栏
   .tool {
      position: fixed;
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
      border: 1px solid rgba(255, 255, 255, .3);
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