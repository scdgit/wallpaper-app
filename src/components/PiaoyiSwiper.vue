<template>
	<view class="uni-margin-wrap" :style="{ borderRadius: round + 'rpx' }" @click="_click">
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			:duration="duration" :current="current" indicator-active-color="rgba(255,255,255,.6)" @change="change"
			@animationfinish="animationfinish">
			<swiper-item v-for="(item, index) of bannerList" :key="index">
				<view class="swiper-item uni-bg-red">
					<image class="image" :src="`${BASE_URL}/banner/${item.file}`" mode="aspectFill" :fade-show="true" :lazy-load="true"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup lang="ts">
import { BASE_URL } from '@/config'
let current = ref<number>(0)
const props = defineProps({
	round: {
		type: Number,
		default: 0
	},
	list: {
		type: Array<{ file: string }>,
		default: [{ file: '' }, { file: '' }, { file: '' }]
	},
	// 是否显示指示点
	indicatorDots: {
		type: Boolean,
		default: true
	},
	// 自动轮播
	autoplay: {
		type: Boolean,
		default: false
	},
	// 轮播间隔
	interval: {
		type: Number,
		default: 5000
	},
	// 切换持续时间
	duration: {
		type: Number,
		default: 500
	},
	// 当前页改变时触发
	change: {
		type: Function,
		default: () => { }
	},
	// 动画结束时触发
	animationfinish: {
		type: Function,
		default: () => { }
	},
	// 轮播诶被点击的时候
	click: {
		type: Function,
		default: () => { }
	}
})
const bannerList: any = toRef(props, 'list')
const _click = () => {
	props.click(props.list[current.value])
}
</script>

<style lang="scss" scoped>
.uni-margin-wrap {
	width: 100%;
	box-sizing: border-box;
	background-color: skyblue;
	overflow: hidden;
}

.swiper {
	height: 300rpx;
}

.swiper-item {
	display: block;
	width: auto;
	height: 100%;
	text-align: center;

	.image {
		width: 100%;
		height: 100%;
	}
}
</style>
