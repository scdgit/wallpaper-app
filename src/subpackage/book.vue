<script lang="ts" setup>
import Back from '@/components/Back.vue'
import { 
   initBookDetailContent, initNovels, useNovels, isHaveCollectThisBook,
   collectBook, cancelCollectBook
} from '@/hooks/novel'
import { encryptData, decryptData, getWindowHeight } from '@/utils'
import { BookType } from '@/type'

const book = ref<BookType>(null)
const love = ref<boolean>(false)
const windowHeight = ref<string>(null)
let backUrl: string // 返回地址

onLoad((option) => {
   if (useNovels.length <= 0) initNovels()
   book.value = decryptData(option.book)
   backUrl = decryptData(option.back)
   getWindowHeight().then(H => {
      windowHeight.value = H + 50 + 'px'
   })
   love.value = isHaveCollectThisBook(book.value) ? true : false
})

// 预览书本内容
const preview = async () => {
   uni.showLoading()
   initBookDetailContent(book.value.bookname).then(() => {
      // 初始化存储的数据
      uni.setStorageSync('BOOK_DETAIL_TYPE', 'prev')
      uni.setStorageSync('BOOK_DETAIL_NUM', 1)
      uni.hideLoading()
      // 跳转到预览页面
      uni.navigateTo({
         url: `/subpackage/book-detail?total=${encryptData(book.value.numberOfFiles)}&bookname=${encryptData(book.value.bookname)}`
      })
   })
}

// 收藏与取消收藏
const doLove = () => {
   love.value = !love.value
   if (love.value) {
      collectBook(book.value)
   } else {
      cancelCollectBook(book.value)
   }
}
</script>

<!-- 书本简介页面 -->
<template>
   <view class="book" :style="{ height: windowHeight }">
      <Back :url="backUrl ? backUrl : '/pages/novel/novel'" />
      <view class="share">
         <svg-icon icon="share" :size="24" color="#666" />
      </view>
      <view class="collect" @click="doLove">
         <svg-icon v-if="!love" icon="love" :size="24" color="#666" />
         <svg-icon v-else icon="love-fill" :size="24" color="red" />
      </view>
      <view class="book-info">
         <view class="book-pic">
            <img class="image" :src="book.bg" alt="" mode="windtFix">
         </view>
         <view class="book-name">{{ book.bookname }}</view>
         <view class="book-author">{{ book.author }}</view>
      </view>
      <view class="title">内容简介</view>
      <view class="introduction">{{ book.introduction }}</view>
      <view class="open" @click="preview">阅读</view>
   </view>
</template>

<style scoped lang="scss">
.book {
   overflow: hidden;
   display: flex;
   flex-direction: column;
   .share {
      position: fixed;
      top: 40rpx;
      right: 44rpx;
   }
   .collect {
      position: fixed;
      right: 44rpx;
      top: 128rpx;
   }
   .image { width: 100%; }
   // 书本信息
   .book-info {
      width: 100%;
      padding: 40rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #FCF8F9;
      .book-pic {
         width: 320rpx;
         margin-bottom: 40rpx;
         border-radius: 8rpx;
         overflow: hidden;
         box-shadow: 0px 10px 10px 0px rgba(210, 116, 141, 0.2);
         line-height: 0;
      }
      .book-name {
         color: #333;
         font-size: 38rpx;
         margin-bottom: 20rpx;
      }
      .book-author {
         font-size: 26rpx;
         color: #666;
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
      &:active { background-color: #E46710; }
   }
}
</style>