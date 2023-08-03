<script lang="ts" setup>
import LoadImg from '@/components/LoadImg.vue'
import { encryptData, decryptData } from '@/utils'
import type { ComicChapterType } from '@/type'
import { COLUMN_BASE_URL } from '@/config'
import { comicDetailJsonApi } from '@/api'
import { saveChapterActive } from '@/hooks/comic'

let bookname: string
let chapter: ComicChapterType // 章节对象
let charterTotalNum = ref<number>()
const imgArr = ref([])
const prevBtn = ref<boolean>(true)
const nextBtn = ref<boolean>(false)

onLoad((options) => {
   chapter = decryptData(options.chapter)
   bookname = chapter.bookname
   charterTotalNum.value = chapter.charterTotalNum
   setBtnStatus(chapter.num, charterTotalNum.value)
   for (let i = 1; i <= chapter.total; i++) {
      const url = `${COLUMN_BASE_URL}/${chapter.bookname}/${chapter.num}/${i}.png`
      imgArr.value.push(url)
   }
   // 记录当前选中的漫画章节
   saveChapterActive({
      bookname: bookname,
      active: Number(chapter.num) - 1
   })
})

// 转化当前章节序号为数字
const setCurrentNum = computed(() => {
   const num = chapter.num
   return num.includes('0') ? Number(num.slice(1)) : Number(num)
})

// 将下标转化为字符串
function initIndex(index: number): string {
   return index >= 10 ? `${index}` : `0${index}`
}

// 设置按钮的禁用状态
function setBtnStatus(num: string, totalNum: number) {
   switch (num) {
      case '01':
         prevBtn.value = true
         nextBtn.value = false
         break
      case initIndex(totalNum):
         prevBtn.value = false
         nextBtn.value = true
         break
      default:
         prevBtn.value = false
         nextBtn.value = false
         break
   }
}

// 获取指定漫画JSON文件中的章节名称
const toggleChapter = (type: 'prev' | 'next') => {
   uni.showLoading()
   comicDetailJsonApi(bookname).then(res => {
      const chapterArr = res.data.chapter
      let targetIndex: number
      let chapterTarget: ComicChapterType
      chapterArr.forEach((ele: ComicChapterType, index: number) => {
         if (ele.num === chapter.num) {
            targetIndex = index
            return
         }
      })
      if (targetIndex !== 0 && !targetIndex) {
         uni.hideLoading()
         return uni.showToast({ title: '切换的章节未找到', icon: 'none' })
      }
      // 修改按钮的状态
      setBtnStatus(initIndex(targetIndex + 1), chapterArr.length)
      chapterTarget = type === 'prev' ? chapterArr[targetIndex - 1] : chapterArr[targetIndex + 1]
      chapterTarget.bookname = bookname
      chapterTarget.charterTotalNum = chapterArr.length
      const url = `/subpackage/comic-detail?chapter=${encryptData(chapterTarget)}`
      setTimeout(() => {
         uni.hideLoading()
         uni.redirectTo({ url }).then(() => {
            uni.pageScrollTo({ scrollTop: 0, duration: 0 })
         })
      }, 200);
   })
}
</script>

<!-- 阅览漫画页面 -->
<template>
   <view class="comic-detail">
      <view class="scroll-view">
         <scroll-view class="scroll-view-box" :scroll-y="true">
            <view class="header">{{ bookname }}-第{{ Number(chapter.num) }}章</view>
            <view class="pic-box">
               <LoadImg v-for="(item) of imgArr" :key="item" :url="item" />
            </view>
            <!-- 切换章节按钮 -->
            <view class="switch-btn">
               <button :disabled="prevBtn" size="mini" @click="toggleChapter('prev')">上一章</button>
               <text class="text">{{ setCurrentNum }} / {{ charterTotalNum }}</text>
               <button :disabled="nextBtn" size="mini" @click="toggleChapter('next')">下一章</button>
            </view>
         </scroll-view>
      </view>
   </view>
</template>

<style scoped lang="scss">
.comic-detail {
   width: 100vw;
   display: flex;
   flex-direction: column;
   align-items: center;
   .header {
      width: 100%;
      height: 80rpx;
      font-size: 30rpx;
      line-height: 80rpx;
      text-indent: 10rpx;
      background-color: #743407;
      color: #fff;
   }
   .pic-box {
      width: 100%;
      line-height: 0;
   }

   .switch-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40rpx 0;

      .text {
         font-size: 20rpx;
      }
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
</style>