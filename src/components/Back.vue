<script setup lang="ts">
const props = defineProps({
   url: {
      type: String,
      default: ''
   },
   params: {
      type: Object,
      default: null
   },

})
// 返回
const back = () => {
   let url = props.url
   if (props.params) {
      let str = '?'
      for (let key in props.params) {
         str += `${key}=${props.params[key]}&`
      }
      url += str.slice(0, str.length - 1)
   }
   uni.reLaunch({ url })
}
</script>

<template>
   <view class="back" @click="back">
      <svg-icon icon="arrow-l" :size="25" color="#999" />
   </view>
</template>

<style scoped lang="scss">
.back {
   position: absolute;
   top: 40rpx;
   left: 40rpx;
   display: flex;
   align-items: center;
}
</style>