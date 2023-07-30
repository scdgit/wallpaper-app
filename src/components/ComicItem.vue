<script lang="ts" setup>
import { COLUMN_BASE_URL } from '@/config'
import { comicDetailJsonApi } from '@/api'
import type { ComicType } from '@/type'

const props = defineProps({
   bookname: {
      type: String,
      default: ''
   }
})

const bookData = ref<ComicType>()

onLoad(() => {
   uni.showLoading()
   comicDetailJsonApi(props.bookname).then((res: any) => {
      uni.hideLoading()
      bookData.value = res.data
   })
})

</script>

<!-- 单个漫画容器组件 -->
<template>
   <view v-if="bookData" class="comic-box">
      <view class="img-box grad-animation">
         <img :src="`${COLUMN_BASE_URL}/${bookname}/bg.png`" alt="" mode="aspectFill" class="img">
         <view class="describe">
            <text class="name">{{ bookData.bookname }}</text>
            <text class="author">{{ bookData.author }}</text>
         </view>
      </view>
      <text class="introduction">{{ bookData.introduction }}</text>
   </view>
</template>

<style scoped lang="scss">
.comic-box {
   width: 100%;
   margin-bottom: 30rpx;
   text-align: justify;
   .img {
      width: 100%;
      line-height: 0;
   }
   .img-box {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      width: 670rpx;
      height: 320rpx;
      box-shadow: 0px 10px 20px 0px rgba(158, 124, 0, 0.2);
      margin-bottom: 6rpx;

      .describe {
         width: 100%;
         position: absolute;
         bottom: 0;
         left: 0;
         z-index: 999;
         background-image: linear-gradient(to top, rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
         color: rgba(255, 255, 255, .8);
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 20rpx 15rpx 10rpx;
         box-sizing: border-box;

         .name {
            font-size: 26rpx;
         }

         .author {
            font-size: 20rpx;
            color: rgba(255, 255, 255, .8);
         }
      }
   }

   .introduction {
      font-size: 26rpx;
      line-height: 40rpx;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: normal !important;
      -webkit-line-clamp: 2; //指定在多少行之后出现 ...
      -webkit-box-orient: vertical;
      color: #333333;
   }
}
</style>