<template>
	<view class="login-box">
		<image :src="`${BASE_URL}/background/b2.jpeg`" mode="aspectFill" class="pic" @load="imgLoad"/>
      <view>
         
      </view>
	</view> 
</template>

<script setup lang="ts">
// import { encryptData } from '@/utils'
import { initMainJsonData, getExpansionApi, getNovelData } from '@/api'
import { BASE_URL } from '@/config'
uni.showLoading({ title: '加载中...' })

// 初始化资源链接
onLoad(async () => {
   // 初始化首页资源
	if (!uni.getStorageSync('DATABASE')) {
	   await initMainJsonData()
   }
	// 获取设备信息
	if (!uni.getStorageSync('deviceType')) {
      uni.getSystemInfo({
         success: function(res) {
            uni.setStorageSync('deviceType', res.uniPlatform)
         }
      })
   }
   // 获取首页扩展功能的接口列表
   if (!uni.getStorageSync('EXPANSIONAPI')) {
      const expansionApi: any = await getExpansionApi()
      uni.setStorageSync('EXPANSIONAPI', expansionApi.data.expansionApi)
   }
   const novels = await getNovelData()
   uni.setStorageSync('NOVELS', novels)
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
