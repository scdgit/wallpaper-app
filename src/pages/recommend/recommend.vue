<script lang="ts" setup>
import WaterFallFlow from '@/components/waterfall-flow.vue'
import Love from '@/components/Love.vue'
import type { ColumnType } from '@/type'
import { initWallpaper } from '@/hooks/wallpaper'
import { AVATAR_URL } from '@/config'

let navValue = ref<number>(0)
let mainData: any = reactive({})
const range = reactive([])
let limit = ref<number>(6)
let isFixed = ref<boolean>(false) // 菜单按钮定位
const popup = ref(null);

onLoad(() => {
   initWallpaper()
   mainData = uni.getStorageSync('DATABASE')
   mainData.column.forEach((element: ColumnType, index: number) => {
      range.push({ value: index, text: element.title, room: element.room })
   })
})

// 导航切换
const toggleNav = (val: number, cb?: () => void) => {
   navValue.value = val
   cb && cb()
}
// 点击菜单中按钮时，屏幕滚动到顶部
watch(() => navValue.value, (nval: number, olval: number) => {
   if (nval !== olval) {
      uni.pageScrollTo({ scrollTop: 0, duration:0 })
   }
})

// 触发到达底部加载数据
onReachBottom(() => {
   uni.$emit('wataerfall-loading', navValue.value)
})

// 页面滚动事件
onPageScroll(({ scrollTop }) => {
   // 显示菜单按钮
   if (scrollTop >= 102) {
      // 定位菜单
      isFixed.value = true
   } else {
      isFixed.value = false
   }
})
const setFixed = computed(() => {
   return isFixed.value
})

// 打开菜单
const openMenu = () => {
   popup.value.open()
}
const closeMenu = () => {
   popup.value.close()
}
</script>

<!-- 分类页面 -->
<template>
   <view class="recommend">
      <!-- 搜索框 -->
      <view class="search-box">
         <view class="search">
            <view class="icon">
               <uni-icons type="search" size="30rpx" color="#606266" />
            </view>
            <input class="uni-input" placeholder="AI插图" placeholder-class="inp-placeholder" />
         </view>
      </view>
      <!-- 导航 -->
      <view class="nav">
         <text v-for="(item, index) of range" :key="index" class="text" :class="{ active: navValue === item.value }"
            :style="{ marginLeft: index !== 0 ? '56rpx' : 0 }" @click="toggleNav(item.value)">{{ item.text }}</text>
         <view class="menu" :class="{ scroll: setFixed }" @click="openMenu">
            <uni-icons type="bars" size="16" />
         </view>
      </view>
      <!-- 内容区域 -->
      <view class="container">
         <view v-for="(item, index) of range" :key="index" class="nav-content"
            :style="{ transform: `translateX(${-navValue * 100}%)` }">
            <transition name="fade">
               <WaterFallFlow v-if="navValue === index" :room="item.room" :column="2" :space="10" :limit="limit"
                  :loadMore="true" :round="6" :index="index">
                  <template #desc="desc">
                     <view class="desc-box">
                        <view class="left">
                           <view class="avatar grad-animation">
                              <img v-if="desc.data.avatar" class="image" :src="`${AVATAR_URL}/${desc.data.avatar}`" lazy-load />
                              <img v-else class="image" src="/src/static/avatar.png" lazy-load />
                           </view>
                           <view class="info">
                              <text class="nickname">{{ desc.data.nickname }}</text>
                              <text class="time">{{ desc.data.time }}</text>
                           </view>
                        </view>
                        <view class="love">
                           <Love :target="desc.data" />
                           <text class="num">{{ desc.data.love }}</text>
                        </view>
                     </view>
                  </template>
               </WaterFallFlow>
            </transition>
         </view>
      </view>
      <!-- 菜单弹出层 -->
      <uni-popup ref="popup" type="left">
         <view class="menu-popup">
            <text v-for="(item, index) of range" :key="index" class="text" :class="{active: navValue === index}"
               @click="toggleNav(item.value, closeMenu)">{{ item.text }}</text>
         </view>
      </uni-popup>
   </view>
</template>

<style scoped lang="scss">
/* 定义淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
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
         font-family: PingFangSC-Medium;
         position: relative;
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

      .menu {
         width: 54rpx;
         height: 40rpx;
         line-height: 40rpx;
         position: absolute;
         right: 0;
         top: 25%;
         z-index: 999;
         text-align: right;

         &.scroll {
            position: fixed;
            top: 80rpx;
            right: 28rpx;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0), #FF6D19);

            ::v-deep .uni-icons {
               color: #fff !important;
            }
         }
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
            padding-top: 4rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;

            .left {
               height: 40rpx;
               display: flex;
               align-items: center;
               .avatar {
                  width: 40rpx;
                  height: 100%;
                  border-radius: 50%;
                  overflow: hidden;
                  margin-right: 4rpx;
                  margin-left: 8rpx;
                  .image {
                     width: 100%;
                     height: 100%;
                  }
               }
               .info {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  line-height: 20rpx;
                  .nickname {
                     font-size: 20rpx;
                     color: #444;
                  }
                  .time {
                     font-size: 16rpx;
                  }
               }
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

   // 菜单弹出框
   .menu-popup {
      width: 132rpx;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 10rpx;

      .text {
         display: block;
         width: 80%;
         height: 60rpx;
         line-height: 60rpx;
         text-align: center;
         color: #000;
         font-size: 24rpx;
         margin: 10rpx 0;
         border-radius: 10rpx;
         &.active {
            background-color: #FF6D19;
            color: #fff;
         }
      }
   }
}</style>