<template>
	<view class="index-page">
		<uni-search-bar placeholder="请输入关键字" @confirm="searchClick" @input="(e:string) => kwd = e.trim()" @cancel="() => kwd = ``" />
		<!-- 轮播图 -->
		<view class="swiper-box">
			<PiaoyiSwiper :list="banner" :round="10" @click="clickBanner" />
		</view>
		<!-- 主体内容区域 -->
		<view class="main">
			<view v-for="(item, i) in column" :key="i" class="main-item">
				<uni-group  class="item-title" :title="item.title" mode="card">
					<!-- 瀑布流 -->
					<WaterFallFlow :room="item.room" :column="3" space="4rpx" />
				</uni-group >
				<!-- 查看详情按钮 -->
				<view class="more">
					<uni-icons type="list" size="20px" />
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import PiaoyiSwiper from '@/components/PiaoyiSwiper.vue'
import WaterFallFlow from '@/components/waterfall-flow.vue'
import type { BannerType, columnType } from '@/type'
import { JSON_URL } from '@/config'
import { decryptData } from '@/utils'

let kwd = ref<string>() // 搜索框关键字
let banner = ref<Array<BannerType>>() // 轮播图数据
let column = ref<Array<columnType>>() // 分类列表

//#ifdef MP-WEIXIN
uni.showShareMenu()
//#endif

// 点击轮播图跳转页面
const clickBanner = (target: BannerType) => {
	console.log(target)
}
onMounted(() => {
	// 解密
	banner.value = decryptData(uni.getStorageSync('banner'))
	// 获取专栏列表
	uni.request({
		url: `${JSON_URL}/main.json`,
		success: (res: any) => {
			column.value = res.data.column
		}
	})
})
// 点击搜索按钮
const searchClick = () => {}
// 专栏详情

</script>

<style scoped lang="scss">
.index-page {
	padding-bottom: 2rpx;
	background: var(--bg-color);
	// 轮播图
	.swiper-box {
		padding: 20rpx;
	}
	// 搜搜框
	::v-deep .uni-searchbar {
		background-color: #efefef;
	}
	.main {
		// 瀑布流
		.main-item {
			min-height: 300rpx;
			position: relative;
			.more {
				position: absolute;
				top: 10px;
				right: 20px;
			}
			::v-deep .uni-group__content {
				padding: 10px;
			}
			::v-deep .uni-group__title {
				background-color: #f7d5d3 !important;
			}
		}
	}
}
</style>
