<template>
	<view class="personal-page page">
		<!-- 用户信息 -->
		<view class="user-info">
			<view class="user-base">
				<image :src="avatar || `/static/avatar.png`"  class="avatar" mode="aspectFill"/>
				<text class="name">{{ nickname || '待完善' }}</text>
			</view>
			<button class="edit" @click="doEdit">编辑信息{{ isEdit ? '☹️' : '☺️' }}</button>
			<view class="edit-options" :class="{ open: isEdit, close: !isEdit }">
				<view class="options-item" @click="editAvatar">🎅<text class="text">头像</text></view>
				<view class="line" />
				<view class="options-item" @click="editNickname">☘️<text class="text">昵称</text></view>
			</view>
		</view>
		<!-- 下载详情 -->
		<view class="center">
			<view class="dolownd-detail">
				<view class="detail-t">
					<text class="text-1">剩余下载次数</text>
					<view class="add">去增加
                  <uni-icons type="fire" size="30rpx" color="#fff" style="margin-left: 2rpx;"/>
					</view>
				</view>
				<view class="count">9999</view>
				<view class="describe">点击去添加按钮可以增加下载次数，每日登陆免费赠送两次</view>
			</view>
		</view>
		<!-- 扩展功能 -->
		<view class="extend">
			<uni-list>
				<uni-list-item title="📙&nbsp;我的收藏" showArrow clickable @click="goTo('/subpackage/favorites')"/>
				<uni-list-item title="️🖨️&nbsp;我的下载" showArrow clickable />
				<uni-list-item title="⚙️️&nbsp;主题设置" showArrow clickable />
				<uni-list-item title="🛰️&nbsp;清除数据" showArrow clickable @click="loginOut"/>
			</uni-list>
		</view>
	</view>
</template>

<script setup lang="ts">
// 是否处于编辑状态
let isEdit = ref<boolean>(false)
let nickname = ref<string>(uni.getStorageSync('nickname'))
let avatar = ref<string>(uni.getStorageSync('avatar'))
// 信息编辑
const doEdit = () => {
	isEdit.value = !isEdit.value
}
//编辑头像
const editAvatar = () => {
	isEdit.value = false
	uni.showActionSheet({ itemList: ['拍照', '相册'] }).then((res) => {
		if (res.tapIndex === 0) {
			// 拍照操作
			uni.chooseImage({ count: 1, sourceType: ['camera'] }).then((imageObj) => {
				uni.showLoading({title: '上传中...'})
				setTimeout(() => {
					avatar.value = imageObj.tempFilePaths[0]
					uni.setStorageSync('avatar', avatar.value)
					uni.hideLoading()
				}, 1000)
			})
		} else {
			// 选择相册
			uni.chooseImage({ count: 1, sourceType: ['album'] }).then((imageObj) => {
				uni.showLoading({title: '上传中...'})
				setTimeout(() => {
					avatar.value = imageObj.tempFilePaths[0]
					uni.setStorageSync('avatar', avatar.value)
					uni.hideLoading()
				}, 1000)
			})
		}
	}).catch(() => {})
}
//编辑昵称
const editNickname = () => {
	uni.showModal({ editable: true, placeholderText: '请输入昵称' }).then((inp: any) => {
		if (!inp.content.trim()) return uni.showToast({title: '内容不能为空', icon: 'error'})
		uni.showLoading({title: '上传中...'})
		setTimeout(() => {
			nickname.value = inp.content
			uni.setStorageSync('nickname', nickname.value)
			uni.hideLoading()
		}, 1000)
	})
	isEdit.value = false
}
// 跳转路由
const goTo = (fullpath: string) => {
   uni.navigateTo({url: fullpath})
}
// 退出登陆
const loginOut = () => {
	console.log(11)
	uni.showModal({ 
		title: '是否清除所有数据？',
		success({confirm}) {
			confirm && uni.clearStorage()
			confirm && uni.showToast({title: '清除成功'})
		},
	})
}
</script>

<style lang="scss" scoped>
.personal-page {

	//用户信息
	.user-info {
		width: 100%;
		padding: 28rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #efefef;

		// 用户的基本信息
		.user-base {
			flex: 1;
			display: flex;
			align-items: center;

			.avatar {
				width: 108rpx;
				height: 108rpx;
				border-radius: 50%;
				margin-right: 28rpx;
				margin-left: 16rpx;
				border: 2rpx solid #333;
			}

			.name {
				font-size: 32rpx;
				font-weight: 500;
			}
		}

		// 编辑信息按钮
		.edit {
			width: 128rpx;
			line-height: 48rpx;
			font-size: 20rpx;
			border-radius: 16rpx;
			border: 2rpx solid #707070;
			font-weight: 400;
			padding: 0;
		}

		// 编辑信息的选项
		.edit-options {
			width: 130rpx;
			height: auto;
			position: fixed;
			top: 130rpx;
			right: 28rpx;
			color: #fff;
			// 上角标
			&::before {
				display: block;
				position: absolute;
				content: '';
				border: 10rpx solid transparent;
				border-bottom-color: #F67C3A;
				top: 0;
				left: 50%;
				transform: translate(-50%, -100%);
			}
			&.open {
				height: auto;
			}

			&.close {
				// height: 0;
				display: none;
			}

			.options-item {
				font-size: 28rpx;
				line-height: 60rpx;
				text-align: center;
				background-color: #F67C3A;
				border-radius: 10rpx;

				.text {
					margin-left: 5rpx;
					font-size: 20rpx;
				}
			}
			// 线
			.line {
				width: 96%;
				height: 2rpx;
				margin: 0 auto;
				background-color: rgba(0,0,0, 0.3);
			}
		}
	}

	.center {
		width: 100%;
		padding: 0 28rpx;
		box-sizing: border-box;
		margin: 20rpx 0;

		//下载详情
		.dolownd-detail {
			width: 100%;
			background: linear-gradient(134deg, #7E27EE 0%, #4323A7 100%);
			border-radius: 14rpx;
			margin: 0 auto;
			color: #fff;
			padding: 28rpx;
			box-sizing: border-box;

			.detail-t {
				display: flex;
				justify-content: space-between;
				color: #fff;
				font-weight: 400;

				.text-1 {
					font-size: 24rpx;
				}

				.add {
					display: flex;
					font-size: 20rpx;
				}
			}

			.count {
				font-size: 48rpx;
				font-weight: bold;
				margin-top: 12rpx;
				margin-bottom: 24rpx;
			}

			.describe {
				font-size: 18rpx;
				font-weight: 300;
				color: #DBDBDB;
			}
		}
	}
	//扩展部分
	.extend {
		width: 100%;
		padding: 0 28rpx;
		box-sizing: border-box;
		font-size: 24rpx;
      .add {
         display: flex;
         align-items: center;
      }
	}
}</style>