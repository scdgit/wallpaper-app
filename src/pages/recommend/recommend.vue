<template>
   <view class="recommend" :style="{minHeight: windowHeight * 2 + 'rpx'}">
      <!-- 搜索框 -->
      <view class="search-box">
         <view class="search">
            <view class="icon">
               <uni-icons type="search" size="30rpx" color="#606266" />
            </view>
            <input class="uni-input" placeholder="AI插图"        
               placeholder-class="inp-placeholder"
            />
         </view>
      </view>
      <!-- 导航 -->
      <view class="nav">
         <text v-for="(item, index) of range" :key="index" class="text"
            :class="{active: navValue === item.value}"
            :style="{marginLeft: index !== 0 ? '56rpx':0}"
            @click="toggleNav(item.value)"
         >{{ item.text }}</text>
         <view class="icon">
            <uni-icons type="bars" size="16" />
         </view>
      </view>
      <!-- 内容区域 -->
      <view class="container">
         <view v-for="(item, index) of range" :key="index"  class="nav-content"
            :style="{ transform: `translateX(${-navValue * 100}%)`}"
         >
            <transition name="fade">
               <WaterFallFlow v-show="navValue === index" :room="item.room" :column="2" :space="10" :limit="limit" :loadMore="true" :round="6" :index="index">
                  <template #desc>
                     <view class="desc-box">
                        <view class="tag">{{ item.text }}</view>
                        <view class="love">
                           <uni-icons type="heart" size="20" color="#303133" />
                           <text class="num">2.4k</text>
                        </view>
                     </view>
                  </template>
               </WaterFallFlow>
            </transition>
         </view>
      </view>
   </view>
</template>

<script lang="ts" setup>
import WaterFallFlow from '@/components/waterfall-flow.vue'
import type { ColumnType } from '@/type'
import { getNavigationH } from '@/utils'

let navValue = ref<number>(0)
let mainData: any = reactive({})
let windowHeight = ref<number>()
const range = reactive([])
let limit = ref<number>(6)

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

// 触发到达底部加载数据
onReachBottom(() => {
   uni.$emit('wataerfall-loading', navValue.value)
})
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
   padding: 0 30rpx;
   overflow-x: hidden;
   box-sizing: border-box;
   overflow: hidden;
   .search-box {
      width: 690rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 26rpx;
      overflow: hidden;
      margin-top: 16rpx;
      margin-bottom: 30rpx;
      .search {
         width: 100%;
         height: 100%;
         padding: 0 16rpx;
         box-sizing: border-box;
         background-color: #F7F9F9;
         display: flex;
         align-items: center;
         .icon {
            margin-right: 8rpx;
         }
         ::v-deep .uni-input-input {
            color: #BFC2CC;
            font-size: 26rpx;
         }
         ::v-deep .inp-placeholder {
            color: #BFC2CC;
            font-size: 26rpx
         }
      }
   }
   .nav {
      width: 100%;
      height: 58rpx;
      line-height: 58rpx;
      box-sizing: border-box;
      margin-bottom: 30rpx;
      position: relative;
      .text {
         font-size: 28rpx;
         color: #303133;
         position: relative;
         font-family: PingFangSC-Medium;
      }
      .icon {
         width: 94rpx;
         height: 40rpx;
         line-height: 40rpx;
         background-image: linear-gradient(to right, transparen,#fff);
         position: absolute;
         right: 0;
         top: 50%;
         transform: translateY(-50%);
         text-align: right;
      }
      .active {
         color: #FF6D19;
      }
      .active::before {
         content: '';
         display: block;
         width: 20rpx;
         height: 6rpx;
         border-radius: 3rpx;
         background-color: #FF6D19;
         position: absolute;
         bottom: -12rpx;
         left: 50%;
         transform: translateX(-50%);
      }
   }
   .container {
      width: 100%;
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
         .desc-box {
            height: 52rpx;
            line-height: 52rpx;
            padding-top: 10rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            .tag {
               width: 72rpx;
               height: 36rpx;
               padding: 2rpx;
               line-height: 36rpx;
               text-align: center;
               font-size: 20rpx;
               color: #FF6D19;
               background-color: #FFF0E7;
               border-radius: 16rpx;
            }
            .love {
               display: flex;
               align-items: center;
               .num {
                  font-size: 20rpx;
                  color: #909399;
               }
            }
         }
      }
   }
}
</style>