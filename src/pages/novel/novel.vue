<template>
   <view class="novel">
      <view class="title">
         <text>所有图书</text>
         <uni-icons type="contact" size="24" color="red"></uni-icons>
      </view>
      <view class="book-list">
         <view v-for="(book, index) of useNovels" :key="index" class="book">
            <view class="img-box grad-animation">
               <img :src="book.bg" alt="" mode="widthFix" style="width: 100%;" />
            </view>
            <view class="desc">
               <view class="book-name">{{ book.bookname }}</view>
               <view class="book-introduction">{{ filterIntroduction(book.introduction) }}</view>
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

<script lang="ts" setup>
import { BookType } from '@/type'
import { useNovels, initBookDetailContent } from '@/hooks'
import { encryptData } from '@/utils'

// 查看书本
const openBook = async (book: BookType) => {
   uni.showLoading({title: '加载中...'})
   initBookDetailContent(book.bookname).then(() => {
      uni.hideLoading()
      uni.navigateTo({
         url: `/subpackage/book-detail?total=${encryptData(book.numberOfFiles)}&bookname=${encryptData(book.bookname)}`
      })
   })
}

// 过滤图书简介
const filterIntroduction = (introduction: string) => {
   return introduction.replace(/[\s：\n]/g, '')
}
</script>

<style scoped lang="scss">
.novel {
   background-color: #F8F8F8;
   height: 100vh;
   padding: 0 40rpx;
   box-sizing: border-box;

   // 顶部导航
   .title {
      height: 68rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333;
      font-size: 40rpx;
      margin: 10rpx 0;
   }

   .book-list {
      display: flex;
      flex-direction: column;

      .book {
         display: flex;
         margin-bottom: 20rpx;

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