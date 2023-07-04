<template>
	<view class="waterfall">
		<view v-for="(list, i) of waterfall" :key="i" 
			class="list" 
			:style="{ width: 100 / column + '%', marginLeft: i===0?'0': space }">
			<view v-for="(item, k) of list" :key="k" 
				class="item" 
				:style="{background: randomColor(),marginTop: k===0?'0': space}">
				<image class="img" :src="`${BASE_URL}/${room}/${item.file}`" mode="widthFix" @click="columnDetails(item)"/>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import type { ImgType } from '@/type'
import { BASE_URL, JSON_URL } from '@/config'
import { randomColor, elementStyle, encryptData } from '@/utils'

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
	}
})

// 瀑布流
let title = ref<string>() // 标题类型
let waterfall:any = reactive([]) // 瀑布中的所有数据
onMounted(() => {
	nextTick(async () => {
		try {
			waterFallLayout(await initList())
		} catch (err) {
			console.error(err)
		}
	})
})
// 获取图片资源
const initList = () => {
	return new Promise((resolve, reject): any => {
		uni.request({
			url: `${JSON_URL}/${props.room}.json`,
			success: (result: any) => {
				title.value = result.data.title
				resolve(result.data.list)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

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
	let itemWidth = (Number(await elementStyle('.waterfall', 'width'))  - parseInt(props.space) * (props.column - 1)) / props.column
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
	img.url = `${BASE_URL}/${props.room}/${img.file}`
	uni.navigateTo({
		url: `/subpackage/wallpaper?img=${encryptData(img)}`
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
			.img {  width: 100%; height: auto;}
		}
	}
}
</style>