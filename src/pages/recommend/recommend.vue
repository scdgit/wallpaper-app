<template>
   <view class="recommend" :style="{minHeight: windowHeight * 2 + 'rpx'}">
      <!-- 顶部导航 -->
      <view class="nav">
         <text v-for="(item, index) of range" :key="index" class="text"
            :class="{active: navValue === item.value}"
            @click="toggleNav(item.value)"
         >{{ item.text }}</text>
      </view>
      <!-- 内容区域 -->
      <view class="container">
         <view v-for="(item, index) of range" :key="index"  class="nav-content"
            :style="{ transform: `translateX(${-navValue * 100}%)`}"
         >
            <transition name="fade">
               <WaterFallFlow v-show="navValue === index" :room="item.room" :column="2" :space="10" :limit="30" :loadMore="true" :round="4"/>
            </transition>
         </view>
      </view>
   </view>
</template>

<script lang="ts" setup>
import WaterFallFlow from '@/components/waterfall-flow.vue'
import type { ColumnType } from '@/type'

let navValue = ref<number>(0)
let mainData: any = reactive({})
let windowHeight = ref<number>()
const range = reactive([])

onLoad(() => {
   mainData = uni.getStorageSync('DATABASE')
   mainData.column.forEach((element: ColumnType, index: number) => {
      range.push({ value: index, text: element.title, room: element.room })
   });
})

// 导航切换
const toggleNav = (val: number) => {
   navValue.value = val
}
</script>

<style scoped lang="scss">
/* 定义淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.recommend {
   padding: 0 0 10rpx;
   overflow-x: hidden;
   box-sizing: border-box;
   background-color: #F5F5F5;
   overflow: hidden;
   .nav {
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: left;
      box-sizing: border-box;
      background-color: #fff;
      .text {
         margin: 0 30rpx;
         color: #444;
         position: relative;
      }
      .active::before {
         content: '';
         display: block;
         width: 80%;
         height: 4rpx;
         background-color: red;
         position: absolute;
         bottom: -12rpx;
         left: 50%;
         transform: translateX(-50%);
      }
   }
   .container {
      width: 100%;
      padding: 20rpx 30rpx;
      min-height: 200px;
      display: flex;
      overflow-x: hidden;
      box-sizing: border-box;
      .nav-content {
         flex-shrink: 0;
         width: 100%;
         height: 100%;
         margin-bottom: 2px;
         position: relative;
         transition: all .35s ease-in-out;
         opacity: 1;
      }
   }
}
</style>