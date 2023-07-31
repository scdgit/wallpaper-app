<script setup lang="ts">
const props = defineProps({
   url: {
      type: String,
      default: ''
   },
   params: {
      type: Object,
      default: null
   }
})
const finish = ref<boolean>(false)
const error = ref<boolean>(false)
const load = () => {
   finish.value = true
}
const imageError = () => {
   finish.value = true
   error.value = true
}
</script>

<template>
   <view class="img-com">
      <image v-if="!error" :src="url" mode="widthFix" alt="" lazy-load class="img" @load="load" @error="imageError" />
      <svg-icon v-if="!finish" icon="loading" color="#888" :size="30" className="loading-icon" />
   </view>
</template>

<style scoped lang="scss">
.img-com {
   width: 100%;
   position: relative;
   .img {
      width: 100%;
   }
   .loading-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 999;
      transform: translate(-50%, -50%);
      animation: identifier .8s ease-out infinite;
   }
}
@keyframes identifier {
   0% {
      transform: translate(-50%, -50%) rotate(0);
   } 100% {
      transform: translate(-50%, -50%) rotate(360deg);
   }
}
</style>