<template>
	<view class="uni-margin-wrap" :style="{ borderRadius: round + 'rpx' }">
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="getAutoplay" :interval="interval"
			:duration="duration" :current="current" indicator-active-color="rgba(255,255,255,.6)" 
         :style="{height: height * 2 + 'rpx'}"
         @change="change"
			@animationfinish="animationfinish">
			<swiper-item v-for="(item, index) of list" :key="index">
				<view class="swiper-item uni-bg-red">
					<image class="image" :src="item.url" mode="aspectFill" :fade-show="true" :lazy-load="true" @click="goToPreview(item)"/>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup lang="ts">
import { BannerType } from '@/type'
import { encryptData } from '@/utils'
let current = ref<number>(0)

const props = defineProps({
	round: {
		type: Number,
		default: 0
	},
   height: {
      type: Number,
      default: 210
   },
	list: {
		type: Array<BannerType>,
		default: []
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
})

const getAutoplay = computed(() => {
   return props.autoplay
})

const goToPreview = (img: BannerType) => {
   uni.navigateTo({
      url: `/subpackage/wallpaper?img=${encryptData(img)}`
   })
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
	height: 224rpx;
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
