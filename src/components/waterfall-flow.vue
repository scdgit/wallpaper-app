<template>
   <view class="waterfall">
      <view class="list-container">
         <view v-for="(list, i) of waterfall" :key="i" class="list"
            :style="{ width: listWidth + '%', marginLeft: i === 0 ? '0' : space * 2 + 'rpx' }"
         >
            <view v-for="(item, k) of list" :key="k" class="item"
               :style="{ 
                  background: randomColor(), 
                  marginTop: k === 0 ? '0' : space * 2 + 'rpx',
                  borderRadius: round + 'px'
               }"
            >
               <image class="img" :src="item.url" mode="widthFix" :lazy-load="true" :fade-show="true" @click="columnDetails(item)" />
            </view>
         </view>
      </view>
      <uni-load-more v-if="loadMore" :status="`more`" />
   </view>
</template>

<script setup lang="ts">
import type { ImgType } from '@/type'
import { randomColor, elementStyle, encryptData } from '@/utils'
import { getJsonColumnData } from '@/api'

const props = defineProps({
   room: { // 哪一个仓库地址(图片)
      type: String,
      default: ''
   },
   column: { // 多少列
      type: Number,
      default: 3
   },
   limit: { // 限制显示的图片数量
      type: Number,
      default: 6
   },
   space: { // 间隙
      type: Number,
      default: 4
   },
   data: { // 数据(data传入时，room不用传)
      type: Array<ImgType>,
      default: []
   },
   livekeep: { // 跳转路由时是否保留原始页面
      type: Boolean,
      default: true
   },
   round: { // 圆角
      type: Number,
      default: 0
   },
   endCb: {
      type: Function,
      default: null
   },
   loadMore: { // 是否需要上拉刷新
      type: Boolean,
      default: false
   }
})

let waterfall: any = reactive<Array<[ImgType]>>([]) // 瀑布中的所有数据
let listWidth = ref<number>(0) // 单列的宽度
let _limit = ref<number>(0)

onMounted(() => {
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

watch(() => props.limit, (nval: number, olval: number) => {
   
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
   const containerWidth = Number(await elementStyle('.waterfall', 'width'))
   // 等比缩放后的宽度
   listWidth.value = (containerWidth - props.space * (props.column - 1)) / props.column
   // 每列高度的记录容器
   let tmp = []
   for (let i = 0; i < props.column; i++) {
      tmp.push(0); waterfall.push([])
   }
   // 将图片放入每一个列中
   list.forEach((item: any, index: number) => {
      if (index >= props.limit) return
      if (listWidth.value > 0) item.height = item.height * listWidth.value / item.width
      // 找到最矮的那列并将图片放入其中
      const minIndex = findMinValueAndIndex(tmp)
      waterfall[minIndex].push(item)
      tmp[minIndex] += item.height
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
   box-sizing: border-box;
   overflow: hidden;
   .list-container {
      width: 100%;
      display: flex;
      margin: 0 auto;
   }
   .list {
      width: auto;
      overflow: hidden;
      box-sizing: border-box;
      .item {
         width: auto;
         line-height: 0;
         box-sizing: border-box;
         overflow: hidden;
         .img {
            width: 100%;
         }
      }
   }
}
</style>