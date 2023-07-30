<script lang="ts" setup>
const props = defineProps({
   text: {
      type: String,
      default: ''
   }
})
</script>

<!-- 页面顶部标题组件 -->
<template>
   <view class="title">
      <text>{{ text }}</text>
   </view>
</template>

<style scoped lang="scss">
// 顶部导航
.title {
   height: 68rpx;
   display: flex;
   justify-content: space-between;
   align-items: center;
   color: #333;
   font-size: 40rpx;
   margin-bottom: 30rpx;
}
</style>