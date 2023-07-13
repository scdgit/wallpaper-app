<template>
   <uni-icons v-if="setLove" type="heart-filled" size="20" color="red" @click="doLove(-1)" />
   <uni-icons v-else :type="type" size="20" :color="color" @click="doLove(1)" />
</template>

<script lang="ts" setup>
import { useFavorites, updateFavorites } from '@/hooks'
import { ImgType } from '@/type'

const props: any = defineProps({
   target: {
      type: Object,
      default: null
   },
   type: {
      type: String,
      default: 'heart'
   },
   color: {
      type: String,
      default: '#303133'
   }
})

let isLove = ref<boolean>(false) // 是否收藏

onShow(() => {
   loadLoveBtn()
})

const setLove = computed(() => {
   return isLove.value
})

// 刷新收藏按按
function loadLoveBtn() {
   isLove.value = useFavorites.some((element: ImgType) => {
      return element.url === props.target.url
   })
}

// 点击收藏操作
const doLove = (type: -1 | 1) => {
   if (!props.target) return
   switch(type) {
      case -1: updateFavorites('del', props.target)
         isLove.value = false // 取消
         break
      case 1: updateFavorites('add', props.target)
         isLove.value = true // 收藏
         break
   }
}

</script>

<style scoped></style>