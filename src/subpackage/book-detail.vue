<script lang="ts" setup>
import { decryptData } from '@/utils'
import { novelCurrentPageContent } from '@/api'
import { useBookStartContent, initBookDetailContent } from '@/hooks/novel'

let total: number
let bookname: string
let numberBoxVal: number
const loading = ref<boolean>(false) // 加载中
const popupThemeEle = ref() // DOM
const popupTxtEle = ref() // DOM
const txtSize = ref<number>(18) // 字体大小
const prevContent = ref<string>() // 起始页的内容
const nextContent = ref<string>('下一页的内容') // 下一页的内容
const type = ref<'prev' | 'next'>(uni.getStorageSync('BOOK_DETAIL_TYPE') || 'prev') // 切换类型
const currentNum = ref<number>(uni.getStorageSync('BOOK_DETAIL_NUM') || 1) // 页码
// 主题
const themeArr = reactive({
   active: 0,
   list: [
      { color: '#666', backgroundColor: '#E8E8E8' },
      { color: '#1A1D1A', backgroundColor: '#9C9A9D' },
      { color: '#404E3F', backgroundColor: '#CEEBCD' },
      { color: '#657982', backgroundColor: '#001C28' },
      { color: '#928F8A', backgroundColor: '#393431' }
   ]
})

onLoad(async (options: any) => {
   uni.pageScrollTo({ scrollTop: 0, duration: 0 })
   total = options.total ? decryptData(options.total) : 0
   bookname = options.bookname ? decryptData(options.bookname) : ''
   if (!useBookStartContent.value) {
      try {
         loading.value = true
         uni.showLoading()
         await initBookDetailContent(bookname, currentNum.value)
      } catch(err) {
         console.error(err)
         uni.showToast({ title: '加载失败', icon: 'error' })
      }
      uni.hideLoading()
      loading.value = false
   }
   switch(type.value) {
      case 'prev': 
         prevContent.value = useBookStartContent.value; 
         break
      case 'next': 
         nextContent.value = useBookStartContent.value; 
         break
   }
})

// 获取上一页或下一页的数据
const togglePageNum = async (num: number, types: 'prev' | 'next') => {
   if (num > total) return uni.showToast({ title: '已经没有了' })
   uni.showLoading({ title: '玩命加载中' })
   switch (types) {
      case 'prev':
         prevContent.value = await novelCurrentPageContent(num, bookname)
         break;
      case 'next':
         nextContent.value = await novelCurrentPageContent(num, bookname)
         break;
      default: break
   }
   currentNum.value = num
   type.value = types
   uni.pageScrollTo({ scrollTop: 0, duration: 0 })
   uni.hideLoading()
   uni.setStorageSync('BOOK_DETAIL_TYPE', type.value)
   uni.setStorageSync('BOOK_DETAIL_NUM', currentNum.value)
}

// 弹出主题选择框
const openThemePopup = () => {
   popupThemeEle.value.open()
}

// 切换出题
const toggltTheme = (index: number) => {
   themeArr.active = index
   popupThemeEle.value.close()
}

// 打开字体大小调试窗口
const openTxtPopup = () => {
   popupTxtEle.value.open()
}
const txtSizeChange = (val: number) => {
   numberBoxVal = val
}
const setTxtSize = computed(() => {
   return txtSize.value * 2 + 'rpx'
})
const setLineHeight = computed(() => {
   return (txtSize.value + txtSize.value * 0.5) * 2 + 'rpx'
})
const popupTxtEleChange = ({ show }) => {
   !show && (txtSize.value = numberBoxVal)
}
</script>

<!-- 书本详情页面 -->
<template>
   <view v-show="!loading" class="book-detail" :style="{ ...themeArr.list[themeArr.active], fontSize: setTxtSize, lineHeight: setLineHeight }">
      <view class="swiper-box">
         <view v-if="type === 'prev'" class="prev-box">
            <text>{{ prevContent }}</text>
            <view v-if="currentNum > 1" class="prev-bth btn" @click="togglePageNum(currentNum - 1, 'prev')">上一页</view>
            <view class="next-bth btn" @click="togglePageNum(currentNum + 1, 'next')">下一页</view>
            <view class="theme-btn">
               <svg-icon icon="theme" color="#FF6D19" :size="26" @click="openThemePopup" />
            </view>
            <view class="txt-btn">
               <svg-icon icon="text" color="#FF6D19" :size="26" @click="openTxtPopup" />
            </view>
         </view>
         <view v-else class="next-box">
            <text>{{ nextContent }}</text>
            <view v-if="currentNum > 1" class="prev-bth btn" @click="togglePageNum(currentNum - 1, 'prev')">上一页</view>
            <view class="next-bth btn" @click="togglePageNum(currentNum + 1, 'next')">下一页</view>
         </view>
      </view>
      <!-- 主题选项弹出层 -->
      <uni-popup ref="popupThemeEle" type="bottom">
         <view class="theme-popup">
            <view v-for="(item, index) of themeArr.list" :key="index" :style="item" class="theme-item"
               :class="{ active: themeArr.active === index }" @click="toggltTheme(index)" />
         </view>
      </uni-popup>
      <!-- 字体大小调试器 -->
      <uni-popup ref="popupTxtEle" type="center" @change="popupTxtEleChange">
         <view class="txt-popup">
            <uni-number-box :value="txtSize" @change="txtSizeChange" />
         </view>
      </uni-popup>
   </view>
</template>

<style scoped lang="scss">
.book-detail {
   position: relative;
   padding: 20rpx;
   text-align: justify;
   padding-bottom: 240rpx;
   overflow: hidden;

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

   .txt-btn {
      position: absolute;
      top: 40rpx;
      right: 120rpx;
   }

   // 主题选项菜单
   .theme-popup {
      width: 100vw;
      padding: 40rpx 0;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      overflow: hidden;
      background-color: #fff;

      .theme-item {
         width: 100rpx;
         height: 100rpx;
         box-sizing: border-box;

         &.active {
            border: 4rpx solid pink;
         }
      }
   }

   // 文本调试器
   .txt-popup {
      width: 90vw;
      display: flex;
      justify-content: center;
   }
}</style>