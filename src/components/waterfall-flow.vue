<template>
   <view class="waterfall">
      <view class="list-container">
         <view v-for="(list, i) of waterfall" :key="i" class="list"
            :style="{ width: listWidth + '%', marginLeft: i !== 0 ? setSpace : '' }">
            <view v-for="(item, k) of list" :key="k" class="item" :style="{
               marginTop: k !== 0 ? setSpace : '',
            }">
               <view style="width: 100%;" class="grad-animation">
                  <image class="img" :src="item.url" mode="widthFix" :lazy-load="true" :fade-show="true" :style="{
                     borderRadius: round + 'px'
                  }" @click="columnDetails(item)" />
               </view>
               <slot name="desc" :data="item"/>
            </view>
         </view>
      </view>
      <uni-load-more v-if="loadMore" :status="setStatusText" />
   </view>
</template>

<script setup lang="ts">
import type { ImgType } from '@/type'
import { elementStyle, encryptData } from '@/utils'
import { getJsonColumnData } from '@/api'
import { initPreviewData } from '@/hooks'

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
   },
   index: {
      type: Number,
      default: null
   }
})

let waterfall: any = reactive<Array<[ImgType]>>([]) // 瀑布中的所有数据
let listWidth: number // 单列的宽度
let _list: Array<ImgType> // 存储全部图片
let _limit: number = props.limit - 0 // 记录加载数量
let containerWidth = 0 // 瀑布宽度
let clolumnArrHeight = [] // 记录瀑布流中各列的高度
let loadStatus = ref<string>()

onMounted(() => {
   nextTick(async () => {
      // 换算后每个图片的宽度
      containerWidth = Number(await elementStyle('.waterfall', 'width'))
      listWidth = (containerWidth - props.space * (props.column - 1)) / props.column
      // 传入的是数据列表[不需要发送请求]
      if (props.data.length > 0 && !props.room) {
         _list = props.data
         waterFallLayout(_list)
      } else if (props.room) {
         // 需要发送请求获取数据
         try {
            const data = await getJsonColumnData(`${props.room}.json`)
            waterFallLayout(data.list)
            _list = data.list
            if (_limit >= _list.length) loadStatus.value = 'noMore'
         } catch (err) {
            console.error(err)
         }
      }
   })
})

// 间隙
const setSpace = computed(() => {
   return props.space * 2 + 'rpx'
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
const waterFallLayout = (list: any) => {
   for (let i = 0; i < props.column; i++) {
      clolumnArrHeight.push(0); waterfall.push([])
   }
   // 将图片放入每一个列中
   list.forEach((item: any, index: number) => {
      if (index >= _limit) return loadStatus.value = 'noMore'
      item.height = listWidth / item.ratio
      // 找到最矮的那列并将图片放入其中
      const minIndex = findMinValueAndIndex(clolumnArrHeight)
      waterfall[minIndex].push(item)
      clolumnArrHeight[minIndex] += item.height
   })
}
// 触发下拉加载
uni.$on('wataerfall-loading', (_current: number) => {
   if (_current !== props.index) return loadStatus.value = 'more'
   if (_limit >= _list.length) return loadStatus.value = 'noMore'
   loadStatus.value = 'loading'
   const insertArr = _list.slice(_limit, _limit + 6)
   _limit += 6
   setTimeout(() => {
      inserToWaterfall(insertArr)
   }, 500)
})
// 向瀑布流中追加数据
function inserToWaterfall(arr: Array<ImgType>) {
   arr.forEach((img: ImgType) => {
      const minIndex = findMinValueAndIndex(clolumnArrHeight)
      img.height = listWidth / img.ratio
      waterfall[minIndex].push(img)
      clolumnArrHeight[minIndex] += img.height
   })
   if (_limit >= _list.length) loadStatus.value = 'noMore'
   else loadStatus.value = 'more'
}
// 设置底部加载文本
const setStatusText = computed(() => {
   return loadStatus.value
})
// 点击进入图片预览
const columnDetails = (img: ImgType) => {
   let pre_path: string
   const pages = getCurrentPages()
   if (!props.livekeep) pre_path = '/' + pages[pages.length - 1].route
   // 初始化上下滑动的数据
   initPreviewData(_list)
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
         display: flex;
         flex-direction: column;

         .img {
            width: 100%;
         }
      }
   }
}
</style>