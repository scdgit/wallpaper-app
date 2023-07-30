<template>
   <view class="wallpaper">
      <!-- 图片预览 -->
      <swiper class="swiper" vertical :duration="duration" :current="index" @change="toggleImg">
         <swiper-item v-for="(item, i) of usePreviewData" :key="i">
            <view v-if="i >= index - 1 && i <= index + 1" class="preview">
               <MyImage :src="item.url" mode="widthFix" />
               <view class="tool">
                  <view class="tool-item">
                     <img v-if="item.avatar" class="avatar grad-animation" :src="`${AVATAR_URL}/${item.avatar}`" lazy-load />
                     <img v-else class="avatar" src="@static/avatar.png" lazy-load />
                  </view>
                  <view class="tool-item">
                     <Love :target="item" type="heart-filled" color="#fff"/>
                     <text class="text">{{ item.love }}</text>
                  </view>
                  <view class="tool-item">
                     <uni-icons type="download-filled" color="#fff" @click="toDownload(img)" /><!-- 下载 -->
                     <text class="text">下载</text>
                  </view>
                  <!-- 分享 -->
                  <view v-if="deviceType === 'app'" class="tool-item" @click="shareByApp">
                     <uni-icons type="redo-filled" color="#fff" />
                     <text class="text">分享</text>
                  </view>
                  <view v-else-if="deviceType === 'web'" class="tool-item" @click="shareWeb">
                     <uni-icons type="redo-filled" color="#fff" />
                     <text class="text">分享</text>
                  </view>
                  <label v-else class="tool-item" for="share-btn">
                     <uni-icons type="redo-filled" color="#fff" />
                     <text class="text">分享</text>
                  </label>
                  <view class="tool-item" @click="goBack">
                     <view class="back">
                        <uni-icons type="pulldown" color="#fff" /><!-- 返回 -->
                     </view>
                     <text class="text">返回</text>
                  </view>
               </view>
               <button id="share-btn" open-type="share" style="display: none;" />
            </view>
         </swiper-item>
      </swiper>
   </view>
</template>

<script setup lang="ts">
import MyImage from '@/components/MyImage.vue'
import Love from '@/components/Love.vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { HOST, AVATAR_URL } from '@/config'
import type { ImgType } from '@/type'
import { decryptData, saveImgToAlbum } from '@/utils'
import { useWallFavorites, updateWallpaper, previewTargetIndex, usePreviewData } from '@/hooks'

let img: ImgType // 图片对象
const deviceType = uni.getStorageSync('deviceType') // 当前设备类型
const isCollect = ref<boolean>(false) // 是否收藏
let pre_path = '' // 跳转前的页面
let duration = ref<number>(500) // 动画时长
let index = ref<number>(0) // 轮播图位置

onLoad((options: any) => {
   img = options.img ? decryptData(options.img) : null
   pre_path = options.pre_path
   index.value = previewTargetIndex(img)
   // 判断是否已收藏
   useWallFavorites.forEach((element: ImgType) => {
      if (element.file === img.file) return isCollect.value = true
   });
})

// 切换轮播触发
const toggleImg = ({ detail }) => {
   img = usePreviewData[detail.current]
   index.value = detail.current
   if (detail.current === usePreviewData.length - 1) {
      uni.showToast({ title: '到底了', icon: 'none' })
   }
}

// 返回按钮
const goBack = () => {
   if (pre_path == 'undefined' || !pre_path) {
      const page = getCurrentPages()
      if (page.length > 1) uni.navigateBack({ delta: 2 })
      else uni.switchTab({ url: '/pages/index/index' })
   } else {
      try {
         uni.redirectTo({ url: pre_path })
      } catch (error) {
         uni.reLaunch({ url: pre_path })
      }
   }
}

// 非app生效的分享功能
onShareAppMessage(() => {
   return {
      desc: '点击查看更多精美壁纸',
      path: `/subpackage/wallpaper?url=${img.url}`
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
      updateWallpaper('add', img)
      msg = '已收藏'
   } else { // 取消收藏
      updateWallpaper('del', img)
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
   .swiper {
      width: 100%;
      min-height: 100vh;
      overflow: hidden;
   }

   .preview {
      width: 100%;
      height: 100%;
   }

   // 工具栏
   .tool {
      position: fixed;
      z-index: 99;
      bottom: 8%;
      right: 2rpx;
      width: 50px;
      color: #fff;

      .tool-item {
         width: 100%;
         height: 60px;
         color: #fff;
         text-align: center;
         display: flex;
         align-items: center;
         flex-direction: column;
         justify-content: center;
         margin-bottom: 10rpx;
         text-shadow: 0 0 10rpx #444;
         ::v-deep .uni-icons {
            font-size: 60rpx !important;
         }
         .avatar {
            display: block;
            width: 76rpx;
            height: 76rpx;
            border-radius: 50%;
            margin: 0 auto;
         }
         .text {
            font-size: 24rpx;
         }

         .back {
            transform: rotate(90deg);
         }
      }
   }
}
</style>