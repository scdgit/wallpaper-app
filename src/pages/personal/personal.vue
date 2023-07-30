<script setup lang="ts">
import { USE_MANUAL, BASE_URL } from '@/config'
import { documentPreview, getWindowHeight } from '@/utils'
import type { UserType } from '@/type'

const initUser = {
   id: null,
   nickname: '',
   avatar: '',
   integral: null
}

// 是否处于编辑状态
const isEdit = ref<boolean>(false)
const windowHeight = ref<string>()
const token = ref<string>(null) // 登录授权
let userinfo = reactive<UserType>(initUser)

onLoad(() => {
   token.value = uni.getStorageSync('token')
   userinfo = uni.getStorageSync('userinfo') ? JSON.parse(uni.getStorageSync('userinfo')) : initUser
   getWindowHeight().then((H: number) => {
      windowHeight.value = H + 'px'
   })
})

//编辑头像
const editAvatar = () => {
   isEdit.value = false
   uni.showActionSheet({ itemList: ['拍照', '相册'] }).then((res) => {
      if (res.tapIndex === 0) {
         // 拍照操作
         uni.chooseImage({ count: 1, sourceType: ['camera'] }).then((imageObj) => {
            uni.showLoading({ title: '上传中...' })
            setTimeout(() => {
               userinfo.avatar = imageObj.tempFilePaths[0]
               uni.setStorageSync('userinfo', JSON.stringify(userinfo))
               uni.hideLoading()
            }, 1000)
         })
      } else {
         // 选择相册
         uni.chooseImage({ count: 1, sourceType: ['album'] }).then((imageObj) => {
            uni.showLoading({ title: '上传中...' })
            setTimeout(() => {
               userinfo.avatar = imageObj.tempFilePaths[0]
               uni.setStorageSync('userinfo', JSON.stringify(userinfo))
               uni.hideLoading()
            }, 1000)
         })
      }
   }).catch(() => { })
}
//编辑昵称
const editNickname = () => {
   uni.showModal({ editable: true, placeholderText: '请输入昵称' }).then((inp: any) => {
      if (!inp.content) return // 取消编辑
      if (!inp.content.trim()) return uni.showToast({ title: '内容不能为空', icon: 'error' })
      uni.showLoading({ title: '上传中...' })
      setTimeout(() => {
         userinfo.nickname = inp.content
         uni.setStorageSync('userinfo', JSON.stringify(userinfo))
         uni.hideLoading()
      }, 1000)
   })
   isEdit.value = false
}
// 跳转路由
const goTo = (fullpath: string) => {
   uni.navigateTo({ url: fullpath })
}
</script>

<!-- 个人中心页面 -->
<template>
   <view v-if="token" class="personal-page page" :style="{ height: windowHeight }">
      <!-- 用户信息 -->
      <view class="user-info">
         <image :src="userinfo.avatar || `/static/avatar.png`" class="avatar" mode="aspectFill" @click="editAvatar" />
         <text class="name" @click="editNickname">{{ userinfo.nickname || '待完善' }}</text>
      </view>
      <!-- 方块列表 -->
      <view class="blocak-list">
         <!-- 会员类型 -->
         <view class="item" style="background-color:#FF6B03;">
            <text class="title">类型</text>
            <text class="text">---</text>
         </view>
         <view class="item" style="background-color:#1093ED;">
            <text class="title">到期日</text>
            <text class="text">---</text>
         </view>
         <!-- 积分 -->
         <view class="item" style="background-color:#EEC60A;">
            <text class="title">积分</text>
            <text class="text">{{ userinfo.integral }}</text>
         </view>
      </view>
      <!-- 按钮栏 -->
      <view class="btn-box">
         <view class="btn" @click="goTo('/subpackage/integral')">
            <svg-icon icon="recharge" :size="20" color="#10A6E2" />
            <text class="text">积分获取</text>
            <view class="arraw">
               <svg-icon icon="arrow-r" :size="15" color="#999" />
            </view>
         </view>
         <view class="btn" @click="goTo('/subpackage/favorites')">
            <svg-icon icon="favorites" :size="20" color="#EEC60A" />
            <text class="text">收藏夹</text>
            <view class="arraw">
               <svg-icon icon="arrow-r" :size="15" color="#999" />
            </view>
         </view>
         <view class="btn">
            <svg-icon icon="about" :size="20" color="#1093ED" />
            <text class="text">关于我们</text>
            <view class="arraw">
               <svg-icon icon="arrow-r" :size="15" color="#999" />
            </view>
         </view>
         <view class="btn" @click="goTo('/subpackage/set-up')">
            <svg-icon icon="set" :size="20" color="#6C7084" />
            <text class="text">设置</text>
            <view class="arraw">
               <svg-icon icon="arrow-r" :size="15" color="#999" />
            </view>
         </view>
      </view>
   </view>
   <view v-else class="to-login" :style="{ height: windowHeight }">
      <svg-icon icon="warn" :size="60" color="red" />
      <view class="login-btn" @click="goTo('/subpackage/login-user')">去登录</view>
   </view>
</template> 

<style lang="scss" scoped>
.personal-page {
   background-color: #F8F8F8;
   box-sizing: border-box;
   overflow-y: scroll;
   overflow-x: hidden;

   //用户信息
   .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 80rpx;
      margin-top: 40rpx;

      .avatar {
         width: 160rpx;
         height: 160rpx;
         border-radius: 50%;
         border: 1rpx solid #333;
      }

      .name {
         font-size: 32rpx;
         color: #1D1E1F;
         margin-top: 20rpx;
      }
   }

   // 方块列表
   .blocak-list {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 40rpx;
      box-sizing: border-box;
      margin-bottom: 80rpx;

      .item {
         width: 196rpx;
         height: 164rpx;
         border-radius: 12rpx;
         color: #fff;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;

         .title {
            font-size: 24rpx;
            margin-bottom: 8rpx;
         }

         .text {
            font-size: 32rpx;
         }
      }
   }

   // 按钮栏
   .btn-box {
      width: 100%;
      padding: 0 40rpx;
      box-sizing: border-box;

      .btn {
         position: relative;
         width: 670rpx;
         height: 128rpx;
         margin-bottom: 20rpx;
         display: flex;
         justify-content: flex-start;
         align-items: center;
         padding: 0 40rpx;
         box-sizing: border-box;
         color: #333333;
         background-color: #fff;

         &:active {
            background: #efefef;
         }

         .text {
            margin-left: 24rpx;
         }

         .arraw {
            position: absolute;
            top: 50%;
            right: 40rpx;
            transform: translateY(-50%);
         }
      }
   }
}

.to-login {
   width: 100%;
   background-color: #F8F8F8;
   padding: 0 40rpx;
   box-sizing: border-box;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   .login-btn {
      width: 100%;
      height: 100rpx;
      background-color: #31A7EA;
      border-radius: 10rpx;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
      font-size: 30rpx;
      color: #fff;
      font-weight: bold;
      text-align: center;
      line-height: 100rpx;
      margin-top: 80rpx;

      &:active {
         background-color: rgb(39, 148, 211);
      }
   }
}</style>