<script lang="ts" setup>
import { loginApi, registerApi } from '@/api'
import { updateUserInfo } from '@/hooks/user'

const uname = ref<string>('')
const password = ref<string>('')
const email = ref<string>('')
const active = ref<number>(1)

const unameInp = (val: string) => {
   uname.value = val.trim()
}
const passInp1 = (val: string) => {
   password.value = val.trim()
}
const emailInp = (val: string) => {
   email.value = val.trim()
}

const toggleActive = (index: number) => {
   uname.value = ''
   password.value = ''
   email.value = ''
   active.value = index
}

// 用户名校验
const unameCheck = () => {
   const regex = /^[a-zA-Z0-9_]{3,16}$/
   return regex.test(uname.value)
}

// 密码校验
const passwordCheck = () => {
   const regex = /^[a-zA-Z0-9_]{6,12}$/
   return regex.test(password.value)
}

// 邮箱校验
const emailCheck = () => {
   const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
   return regex.test(email.value)
}

const doLogin = () => {
   if (!uname.value || !password.value) return uni.showToast({ title: '信息不完整', icon: 'none' })
   if (!unameCheck()) {
      return uni.showToast({ title: '用户名不符合规范', icon: 'none' })
   }
   if (!passwordCheck()) {
      return uni.showToast({ title: '密码不符合规范', icon: 'none' })
   }
   loginApi(uname.value, password.value).then((res: any) => {
      if (res.data.code === 1) {
         const { uname, nickname, avatar, id, userIntegral } = res.data
         // 存储token
         uni.setStorageSync('TOKEN', res.data.token)
         // 存储用户信息
         updateUserInfo({ uname, nickname, avatar, id, userIntegral })
         // 跳转路由
         uni.switchTab({ url: '/pages/personal/personal' })
      } else {
         if (typeof res.data === 'string') uni.showToast({ title: '服务器错误', icon: 'error' })
         else uni.showToast({ title: res.data.msg, icon: 'error' })
      }
   }).catch(() => {
      uni.showToast({ title: '网络错误', icon: 'error' })
   })
}

const doRegister = () => {
   if (!uname.value || !password.value || !email.value) return uni.showToast({ title: '信息不完整', icon: 'none' })
   if (!unameCheck()) {
      uname.value = ''
      return uni.showToast({ title: '用户名不符合规范', icon: 'none' })
   }
   if (!passwordCheck()) {
      password.value = ''
      return uni.showToast({ title: '密码不符合规范', icon: 'none' })
   }
   if (!emailCheck()) {
      email.value = ''
      return uni.showToast({ title: '邮箱不符合规范', icon: 'none' })
   }
   registerApi(uname.value, password.value, email.value).then((res: any) => {
      if (res.data.code === 1) {
         const { uname, nickname, avatar, insertId, token, userIntegral } = res.data
         // 储存用户信息
         updateUserInfo({ uname, nickname, avatar, id: insertId, userIntegral })
          // 存储token
         uni.setStorageSync('TOKEN', token)
         // 跳转理由
         uni.switchTab({ url: '/pages/personal/personal' })
      } else {
         if (typeof res.data === 'string') uni.showToast({ title: '服务器错误', icon: 'error' })
         else uni.showToast({ title: res.data.msg, icon: 'error' })
      }
   }).catch(() => {
      uni.showToast({ title: '网络错误', icon: 'error' })
   })
}

</script>

<template>
   <view class="login-user">
      <view class="nav-box">
         <view class="nav-item" :class="{ active: active === 1 }" @click="toggleActive(1)">登录</view>
         <view class="nav-item" :class="{ active: active === 2 }" @click="toggleActive(2)">注册</view>
      </view>
      <view class="title">欢迎回来！</view>
      <view class="login-info">
         <view class="uname inp">
            <uni-easyinput errorMessage focus :value="uname" placeholder="用户名" @input="unameInp" />
         </view>
         <view class="password inp">
            <uni-easyinput class="uni-mt-5" :value="password" placeholder="密码" type="password" @input="passInp1" />
         </view>
         <view v-if="active === 2" class="password inp">
            <uni-easyinput class="uni-mt-5" :value="email" placeholder="邮箱" :passwordIcon="false" @input="emailInp" />
         </view>
         <view v-if="active === 1" class="forgot-pass">忘记密码？</view>
      </view>
      <button v-if="active === 1" class="submit" @click="doLogin">登录</button>
      <button v-else class="submit" @click="doRegister">注册</button>
   </view>
</template>

<style scoped lang="scss">
.login-user {
   width: 100vw;
   height: 100vh;

   .nav-box {
      width: 100%;
      display: flex;
      justify-content: flex-end;

      .nav-item {
         width: 100rpx;
         font-size: 34rpx;
         font-weight: 500;
         color: #000;
         text-align: center;
         margin: 40rpx;

         &.active {
            color: #003DFC;
            position: relative;

            &::after {
               position: absolute;
               bottom: -20rpx;
               left: 50%;
               transform: translateX(-50%);
               content: '';
               display: block;
               width: 90%;
               height: 8rpx;
               background-color: #003DFC;
            }
         }
      }
   }

   .title {
      margin-left: 100rpx;
      font-family: Poppins;
      font-size: 60rpx;
      font-weight: 500;
      margin-top: 220rpx;
   }

   .login-info {
      width: 100%;
      margin-top: 60rpx;

      .inp {
         width: 80%;
         margin: 0 auto;
         margin-bottom: 28rpx;
      }

      .forgot-pass {
         width: 80%;
         font-size: 20rpx;
         margin: 0 auto;
         color: #003DFC;
      }
   }

   .submit {
      width: 80%;
      background-color: #003DFC;
      color: #fff;
      font-size: 26rpx;
      margin-top: 40rpx;

      &:active {
         background-color: #3763EE;
      }
   }
}
</style>