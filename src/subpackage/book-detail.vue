<template>
   <view class="book-detail" :class="{ dark: theme === 'dark' }">
      <view class="swiper-box">
         <view v-if="type === 'prev'" class="prev-box">
            <text>{{ prevContent }}</text>
            <view v-if="current > 1" class="prev-bth btn" @click="togglePageNum(current - 1, 'prev')">上一页</view>
            <view class="next-bth btn" @click="togglePageNum(current + 1, 'next')">下一页</view>
            <view class="theme-btn">
               <svg-icon v-if="theme === `dark`" icon="sun" color="#FF6D19" :size="20" @click="toggleTheme('light')" />
               <svg-icon v-else icon="moon" color="#FF6D19" :size="20" @click="toggleTheme('dark')" />
            </view>
         </view>
         <view v-else class="next-box">
            <text>{{ nextContent }}</text>
            <view v-if="current > 1" class="prev-bth btn" @click="togglePageNum(current - 1, 'prev')">上一页</view>
            <view class="next-bth btn" @click="togglePageNum(current + 1, 'next')">下一页</view>
         </view>
      </view>
   </view>
</template>

<script lang="ts" setup>
import { decryptData } from '@/utils'
import { novelCurrentPageContent } from '@/api'
import { useBookStartContent } from '@/hooks'

let total: number
const current = ref<number>(1)
let bookname: string
const theme = ref<string>('dark')
let prevContent = ref<string>() // 起始页的内容
let nextContent = ref<string>('下一页的内容') // 下一页的内容
let type = ref<string>('prev') // 切换类型

onLoad(async (options: any) => {
   uni.pageScrollTo({ scrollTop: 0, duration: 0 })
   total = options.total ? decryptData(options.total) : 0
   bookname = options.bookname ? decryptData(options.bookname) : ''
   prevContent.value = useBookStartContent
})

// 获取上一页或下一页的数据
const togglePageNum = async (num: number, types: 'prev' | 'next') => {
   if (num > total) return uni.showToast({ title: '已经没有了' })
   uni.showLoading({title: '玩命加载中'})
   switch (types) {
      case 'prev':
         prevContent.value = await novelCurrentPageContent(num, bookname)
         break;
      case 'next':
         nextContent.value = await novelCurrentPageContent(num, bookname)
         break;
      default: break
   }
   current.value = num
   type.value = types
   uni.pageScrollTo({ scrollTop: 0, duration: 0 })
   uni.hideLoading()
}

// 切换主题
const toggleTheme = (type: string) => {
   console.log(type)
   theme.value = type
}

</script>

<style scoped lang="scss">
.book-detail {
   position: relative;
   min-height: 100vh;
   font-size: 34rpx;
   padding: 20rpx;
   line-height: 50rpx;
   // 亮色
   background-color: #ccc;
   color: #555;
   text-align: justify;
   padding-bottom: 240rpx;
   overflow: hidden;

   // 暗色
   &.dark {
      background-color: #000 !important;
      color: #666 !important;
   }

   .swiper-box {
      width: 100%;
      min-height: 100%;
      transition: all .35s linear;
   }

   .prev-box,
   .next-box {

      width: 100%;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: "新宋体";

      .btn {
         position: absolute;
         bottom: 100rpx;
         border: 1px solid #888;
         border-radius: 4rpx;
         padding: 2rpx 6rpx;
         font-size: 24rpx;
         color: inherit;

         &.prev-bth {
            left: 60rpx;
         }

         &.next-bth {
            right: 60rpx;
         }
      }
   }

   // 主题切换按钮
   .theme-btn {
      position: absolute;
      right: 40rpx;
      top: 40rpx;
   }
}
</style>