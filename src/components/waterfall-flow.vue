<template>
   <view class="waterfall">
      <view v-for="(list, i) of waterfall" :key="i" class="list"
         :style="{ width: 100 / column + '%', marginLeft: i === 0 ? '0' : space }">
         <view v-for="(item, k) of list" :key="k" class="item"
            :style="{ background: randomColor(), marginTop: k === 0 ? '0' : space }">
            <image class="img" :src="item.url" mode="widthFix" @click="columnDetails(item)" />
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import type { ImgType } from '@/type'
import { randomColor, elementStyle, encryptData } from '@/utils'
import { getJsonColumnData } from '@/api'

const props = defineProps({
   room: {
      type: String,
      default: ''
   },
   column: {
      type: Number,
      default: 3
   },
   limit: { // 限制显示的图片数量
      type: Number,
      default: 6
   },
   space: {
      type: String,
      default: '4rpx'
   },
   data: {
      type: Array<ImgType>,
      default: []
   },
   livekeep: { // 跳转路由时是否保留原始页面
      type: Boolean,
      default: true
   }
})

// 瀑布流
let waterfall: any = reactive<Array<[ImgType]>>([]) // 瀑布中的所有数据
onLoad(() => {
   nextTick(async () => {
      if (props.data.length > 0 && !props.room) {
         waterFallLayout(props.data)
      } else if (props.room) {
         try {
            const data = await getJsonColumnData(`${props.room}.json`)
            waterFallLayout(data.list)
         } catch (err) {
            console.error(err)
         }
      }
   })
})

// 触发更新收藏夹操作
uni.$on('cancel-favorite', () => {
   
})

// 获取数组中最小值的下标
function findMinValueAndIndex(array: Array<number>): number {
   let minValue = array[0];
   let minIndex = 0;
   let newArr = array.slice()
   for (let i = 1; i < newArr.length; i++) {
      if (newArr[i] < minValue) {
         minValue = newArr[i];
         minIndex = i;
      }
   }
   return minIndex;
}
// 设置瀑布流高度，并对图片进行分类摆放
const waterFallLayout = async (list: any) => {
   // 等比缩放后的宽度
   let itemWidth = (Number(await elementStyle('.waterfall', 'width')) - parseInt(props.space) * (props.column - 1)) / props.column
   // 每列高度的记录容器
   let tmp = []
   for (let i = 0; i < props.column; i++) {
      tmp.push(0); waterfall.push([])
   }
   // 将图片放入每一个列中
   list.forEach((item: any, index: number) => {
      if (index >= props.limit) return
      //#ifdef MP-WEIXIN
      itemWidth = 100 / props.column * item.height / item.width
      //#endif
      // 找到最矮的那列并将图片放入其中
      const minIndex = findMinValueAndIndex(tmp)
      waterfall[minIndex].push(item)
      tmp[minIndex] += item.height * itemWidth / item.width
   })
}
// 点击进入图片预览
const columnDetails = (img: ImgType) => {
   let pre_path:string
   const pages = getCurrentPages()
   if (!props.livekeep) pre_path = '/' + pages[pages.length - 1].route
   uni.navigateTo({
      url: `/subpackage/wallpaper?img=${encryptData(img)}&pre_path=${pre_path}`
   })
}
</script>

<style scoped lang="scss">
.waterfall {
   width: 100%;
   min-height: 200rpx;
   display: flex;
   justify-content: space-around;

   .list {
      width: 33%;
      box-sizing: border-box;

      .item {
         width: 100%;
         min-height: 200rpx;
         line-height: 0;
         box-sizing: border-box;

         .img {
            width: 100%;
            height: auto;
         }
      }
   }
}</style>