<template>
	<view class="user-info">
		<button class="avatar-wrapper" open-type="getUserInfo" @click="onChooseAvatar" >
		  <image class="avatar" :src="avatarUrl" ></image>
		</button> 
		<input type="nickname" class="weui-input" placeholder="请输入昵称"/>
	</view>
</template>

<script setup lang="ts">
	import {
		ref
	} from 'vue'
	let isHidden = ref < Boolean > (false)
	// 授权登录
	let avatarUrl = ref < string > (
		'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
	)
	// 头像授权
	const onChooseAvatar = (e:any) => {
		console.log(e)
		avatarUrl.value = e.detail.avatarUrl
		uni.getUserInfo({
			provider:'weixin',
			success(res) {
				console.log(res)
				avatarUrl.value = res.userInfo.avatarUrl
			}
		})
	}
</script>

<style>
</style>
