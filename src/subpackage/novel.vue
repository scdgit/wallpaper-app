<script lang="ts" setup>
import Back from '@/components/Back.vue'
import Title from '@/components/Title.vue'
import { useNovels, initNovels } from '@/hooks/novel'
import { BookType } from '@/type'
import { encryptData } from '@/utils'

onLoad(() => {
   if (useNovels.length <= 0) initNovels()
})

// 查看书本
const openBook = (book: BookType) => {
   uni.navigateTo({ url: `/subpackage/book?book=${encryptData(book)}` })
}
</script>

<!-- 小说列表页 -->
<template>
   <view class="novel">
      <Back url="/pages/index/index" />
      <Title text="所有图书" />
      <view class="book-list">
         <view v-for="(book, index) of useNovels" :key="index" class="book">
            <view class="img-box grad-animation">
               <img :src="book.bg" alt="" mode="widthFix" style="width: 100%;" />
            </view>
            <view class="desc">
               <view class="book-name">{{ book.bookname }}</view>
               <view class="book-introduction">{{ book.introduction }}</view>
               <view class="book-author">
                  <text>作者：{{ book.author }}</text>
               </view>
               <view class="book-chapters">
                  <text>总计：{{ book.numberOfFiles }}页</text>
               </view>
               <view class="open" @click="openBook(book)">观看</view>
            </view>
         </view>
      </view>
   </view>
</template>

<style scoped lang="scss">
.novel {
   background-color: #F8F8F8;
   height: 100vh;
   padding: 128rpx 40rpx 0;
   box-sizing: border-box;

   .book-list {
      display: flex;
      flex-direction: column;

      .book {
         display: flex;
         margin-bottom: 40rpx;
         .img-box {
            width: 152rpx;
            line-height: 0;
            min-height: 200rpx;
            box-shadow: 0px 0px 10px -1px rgba(177, 167, 163, 0.75);
            -webkit-box-shadow: 0px 0px 10px -1px rgba(177, 167, 163, 0.75);
            -moz-box-shadow: 0px 0px 10px -1px rgba(177, 167, 163, 0.75);
         }

         .desc {
            flex: 1;
            position: relative;
            padding-left: 40rpx;
            box-sizing: border-box;

            // 书名
            .book-name {
               font-size: 16px;
               line-height: 44rpx;
               margin-bottom: 12rpx;
            }

            // 简介
            .book-introduction {
               width: 100%;
               font-size: 26rpx;
               color: #666;
               line-height: 32rpx;
               display: -webkit-box;
               overflow: hidden;
               text-overflow: ellipsis;
               word-wrap: break-word;
               white-space: normal !important;
               -webkit-line-clamp: 2; //指定在多少行之后出现 ...
               -webkit-box-orient: vertical;
            }

            // 作者
            .book-author {
               font-size: 24rpx;
               color: #999;
               margin: 10rpx 0;
            }

            // 章节数
            .book-chapters {
               font-size: 24rpx;
               color: #999;
            }

            // 去观看
            .open {
               position: absolute;
               right: 0;
               bottom: 0;
               width: 96rpx;
               height: 40rpx;
               text-align: center;
               line-height: 40rpx;
               border: 2rpx solid #FF6B03;
               font-size: 24rpx;
               color: #FF6B03;
               border-radius: 20rpx;
            }
         }
      }
   }
}</style>