<script lang="ts" setup>
const uname = ref<string>()
const password = ref<string>()
const suffixIcon = ref<'eye' | 'eye-slash'>('eye-slash')
const active = ref<number>(1)
const passType = ref<'password' | 'text'>('password')
const placeholderPass1 = ref<string>('密码')

const unameInp = (val: string) => {
   console.log(val)
}

const iconClick = () => {
   suffixIcon.value = suffixIcon.value === 'eye' ? 'eye-slash' : 'eye'
   passType.value = passType.value === 'password' ? 'text' : 'password'
}

const toggleActive = (index: number) => {
   active.value = index
}

watch(() => active.value, (nval) => {
   if (nval === 2) {
      placeholderPass1.value = '输入密码'
   } else {
      placeholderPass1.value = '密码'
   }
})
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
            <uni-easyinput errorMessage :value="uname" focus placeholder="用户名" @input="unameInp"></uni-easyinput>
         </view>
         <view class="password inp">
            <uni-easyinput class="uni-mt-5" :suffixIcon="suffixIcon" :value="password" :placeholder="placeholderPass1"
               :passwordIcon="false" :type="passType" @icon-click="iconClick"></uni-easyinput>
         </view>
         <view v-if="active === 2" class="password inp">
            <uni-easyinput class="uni-mt-5" :suffixIcon="suffixIcon" :value="password" placeholder="确认密码"
               :passwordIcon="false" :type="passType" @icon-click="iconClick"></uni-easyinput>
         </view>
         <view v-if="active === 1" class="forgot-pass">忘记密码？</view>
      </view>
      <button v-if="active === 1" class="submit">登录</button>
      <button v-else class="submit">注册</button>
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