<script lang="ts" setup>
import { comicDetailJsonApi } from '@/api'
import type { ComicType, ComicChapterType, ComicFavoritesItemType } from '@/type'
import { getWindowHeight, encryptData } from '@/utils'
import { COLUMN_BASE_URL } from '@/config'
import {
   useComicFavorites, initComicFavorites,
   insertComicToFavorites, removeComicFromFavorites,
   useChapterActive, initChapterActive, saveChapterActive
} from '@/hooks/comic'

const jsonData = ref<ComicType>()
const windowHeight = ref<string>()
const love = ref<boolean>(false) // 是否收藏 
const menuEle = ref() // 章节列表DOM
const menuActive = ref<number>(0) // 选中的章节
const bookname = ref<string>()

onLoad(async (option: any) => {
   uni.showLoading()
   bookname.value = option.bookname
   // 初始化选中的章节
   !useChapterActive.value && initChapterActive()
   if (bookname.value === useChapterActive.value.bookname && useChapterActive.value.bookname) {
      menuActive.value = useChapterActive.value.active
   }
   // 获取漫画的JSON数据
   await comicDetailJsonApi(bookname.value).then(res => {
      uni.hideLoading()
      jsonData.value = res.data
   })
   // 设置页面高度
   getWindowHeight().then(H => {
      windowHeight.value = H + 50 + 'px'
   })
   // 判断是否已收藏
   !useComicFavorites.value && initComicFavorites()
   const findRes = useComicFavorites.value.find(ele => JSON.stringify(ele) === JSON.stringify(jsonData.value))
   findRes ? love.value = true : love.value = false
})

// 收藏
const doLove = () => {
   love.value = !love.value
   const obj: ComicFavoritesItemType = {
      bookname: jsonData.value.author,
      author: jsonData.value.author
   }
   if (love.value) {
      // 收藏
      insertComicToFavorites(obj)
   } else {
      // 取消收藏
      removeComicFromFavorites(obj)
   }
}

// 阅读
const preview = () => {
   const chapter = jsonData.value.chapter[menuActive.value]
   chapter.bookname = bookname.value
   chapter.charterTotalNum = jsonData.value.chapter.length
   const url = `/subpackage/comic-detail?chapter=${encryptData(chapter)}`
   uni.navigateTo({url})
}

// 跳转
const goTo = (path: string) => {
   uni.reLaunch({ url: path })
}

// 打开章节列表
const openMenu = () => {
   menuEle.value.open()
}
// 关闭章节列表
const closeDrawer = () => {
   menuEle.value.close()
}
// 切换章节
const toggleChapter = (index: number, chapter: ComicChapterType) => {
   menuActive.value = index
   menuEle.value.close()
   chapter.bookname = bookname.value
   chapter.charterTotalNum = jsonData.value.chapter.length
   const url = `/subpackage/comic-detail?chapter=${encryptData(chapter)}`
   uni.navigateTo({ url }).then(() => {
      // 记录当前选中的章节
      saveChapterActive({
         bookname: bookname.value,
         active: menuActive.value
      })
   })
}
</script>

<!-- 查看漫画页面 -->
<template>
   <view v-if="jsonData" class="open-comic" :style="{ height: windowHeight }">
      <view class="info">
         <view class="pic grad-animation">
            <img class="image" :src="`${COLUMN_BASE_URL}/${jsonData.bookname}/bg.png`" alt="" mode="widthFix">
            <view class="back" @click="goTo('/pages/comic/comic')">
               <svg-icon icon="tag" :size="30" color="#FF842E" />
            </view>
         </view>
         <view class="center">
            <view class="left">
               <view class="name">{{ jsonData.bookname }}</view>
               <view class="author">{{ jsonData.author }}</view>
            </view>
            <view class="right">
               <view class="icon" @click="openMenu">
                  <svg-icon icon="list" :size="20" color="#666" />
               </view>
               <view class="collect icon" @click="doLove">
                  <svg-icon v-if="!love" icon="love" :size="22" color="#666" />
                  <svg-icon v-else icon="love-fill" :size="22" color="red" />
               </view>
            </view>
         </view>
      </view>
      <view class="title">内容简介</view>
      <view class="introduction">{{ jsonData.introduction }}</view>
      <view class="open" @click="preview">阅读</view>
      <!-- 章节列表 -->
      <uni-drawer ref="menuEle" mode="left">
         <view class="scroll-view">
            <scroll-view class="scroll-view-box" scroll-y="true">
               <view class="close-menu">
                  <button @click="closeDrawer"><text class="word-btn-white">关闭</text></button>
               </view>
               <view class="chapter-btn">
                  <button v-for="(chapter, index) of jsonData.chapter" :key="index" :class="{ active: index === menuActive }"
                     size="mini" @click="toggleChapter(index, chapter)">{{ chapter.title }}</button>
               </view>
            </scroll-view>
         </view>
      </uni-drawer>
   </view>
</template>

<style scoped lang="scss">
.open-comic {
   overflow: hidden;
   display: flex;
   flex-direction: column;

   .image {
      width: 100%;
   }

   // 书本信息
   .info {
      position: relative;
      width: 100%;
      padding: 20rpx 20rpx;
      box-sizing: border-box;
      background-color: #FCF8F9;

      .pic {
         position: relative;
         width: 100%;
         margin-bottom: 40rpx;
         border-radius: 8rpx;
         overflow: hidden;
         box-shadow: 0px 10px 10px 0px rgba(210, 116, 141, 0.2);
         line-height: 0;

         .back {
            position: absolute;
            top: 10%;
            left: 0;
         }
      }

      .center {
         width: 100%;
         display: flex;
         align-items: center;
         justify-content: space-between;

         .left {
            display: flex;
            align-items: center;

            .name {
               color: #333;
               font-size: 38rpx;
               margin-right: 20rpx;
            }

            .author {
               font-size: 26rpx;
               color: #666;
            }
         }

         .right {
            display: flex;
            align-items: center;

            .icon {
               margin-left: 20rpx;
            }
         }
      }
   }

   .title {
      color: #333;
      font-size: 48rpx;
      text-align: center;
      padding-top: 60rpx;
      padding-bottom: 50rpx;
      background-color: #E8E8E8;
   }

   .introduction {
      flex: 1;
      overflow-y: scroll;
      background-color: #E8E8E8;
      color: #666;
      font-size: 28rpx;
      line-height: 48rpx;
      padding: 0 40rpx;
      text-align: justify;
      box-sizing: border-box;
      text-indent: 56rpx;
   }

   .open {
      position: fixed;
      bottom: 80rpx;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      width: 410rpx;
      height: 88rpx;
      line-height: 88rpx;
      background-color: #FF842E;
      border-radius: 48rpx;
      color: #fff;
      font-size: 30rpx;
      text-align: center;

      &:active {
         background-color: #E46710;
      }
   }

   .close-menu {
      margin-bottom: 10rpx;
   }

   .chapter-btn {
      text-align: right;
      margin-right: 8rpx;

      .active {
         background-color: #FF842E;
         color: #fff;
      }
   }

   /* 使抽屉章节列表具有y方向滚动条 */
   .scroll-view {
      /* #ifndef APP-NVUE */
      width: 100%;
      height: 100%;
      /* #endif */
      flex: 1
   }

   .scroll-view-box {
      flex: 1;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
   }
}
</style>