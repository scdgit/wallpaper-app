<template>
	<view class="login-box">
		<image :src="`${BASE_URL}/background/b2.jpeg`" mode="aspectFill" class="pic" @load="imgLoad"/>
	</view> 
</template>

<script setup lang="ts">
import { encryptData } from '@/utils'
import { loadJsonData } from '@/api'
import { BASE_URL } from '@/config'
uni.showLoading({ title: '加载中...' })

// 初始化资源链接
onMounted(async () => {
	// 初始化首页资源
	if (!uni.getStorageSync('banner')) {
		const banner = await loadJsonData('banner')
		uni.setStorageSync('banner', encryptData(banner))
	}
	// 获取设备信息
	uni.getSystemInfo({
		success: function(res) {
			uni.setStorageSync('deviceType', res.uniPlatform)
		}
	})
})

const imgLoad = () => {
	setTimeout(() => {
		uni.hideLoading()
		uni.switchTab({ url: '/pages/index/index' })
	}, 4000)
}
</script>

<style scoped lang="scss">
.login-box {
	width: 100vw;
	height: 100vh;
	text-align: center;
	overflow: hidden;

	.pic {
		height: 100%;
		width: 100%;
		margin: 0 auto;
	}
}
</style>
