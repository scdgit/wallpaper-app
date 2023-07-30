<script lang="ts" setup>
import Back from '@/components/Back.vue'
import Title from '@/components/Title.vue'
import ComicItem from '@/components/ComicItem.vue'
import { useComicMainJson, initComicMainJson } from '@/hooks/comic'

let comicName = reactive([])

onLoad(async () => {
   await initComicMainJson()
   comicName.push(...useComicMainJson.value.comicName)
})

// 打开漫画
const openComic = (bookname: string) => {
   const url = `/subpackage/comic-open?bookname=` + bookname
   uni.navigateTo({ url: url })
}
</script>

<!-- 漫画列表 -->
<template>
   <view class="comics">
      <Back url="/pages/index/index" />
      <Title text="所有漫画" />
      <view class="main">
         <ComicItem  v-for="item of comicName" :key="item" :bookname="item" @click="openComic(item)"/>
      </view>
   </view>
</template>

<style scoped lang="scss">
.comics {
   background-color: #F8F8F8;
   height: 100vh;
   padding: 128rpx 40rpx 0;
   box-sizing: border-box;
   .img {
      width: 100%;
      line-height: 0;
   }
}</style>