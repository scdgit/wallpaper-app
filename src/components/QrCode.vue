<template>
   <div ref="qrcodeRef" class="box grad-animation">
      <slot name="extend" />
   </div>
</template>

<script lang="ts" setup>
import QRCode from 'qrcodejs2-fixes'

const props = defineProps({
   codeUrl: { // 生成二维码的链接
      type: String,
      default: null
   }
})

onMounted(() => {
   createQRCode(props.codeUrl)
})

watch(() => props.codeUrl, (nval) => {
   createQRCode(nval)
})

const qrcodeRef = ref(null) // 容器DOM

// 创建二维码     
const createQRCode = (url: string) => {
   if (!props.codeUrl) return
   console.log(url)
   nextTick(() => {
      new QRCode(qrcodeRef.value, {
         text: url,
         width: 205,
         height: 205,
         colorDark: "#000000",
         colorLight: "#ffffff",
         correctLevel: QRCode.CorrectLevel.H
      })
   })
}
</script>

<style lang="scss" scoped>
.box {
   position: relative;
   min-height: 205px;
   min-width: 205px;
   line-height: 0;
}
</style>