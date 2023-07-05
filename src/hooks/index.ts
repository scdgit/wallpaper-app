import { decryptData, encryptData } from '@/utils'
import type { ImgType } from '@/type'
import { reactive } from 'vue'

// 收藏夹中的数据
export let useFavorites = reactive<Array<ImgType>>(uni.getStorageSync('favorites') ? decryptData(uni.getStorageSync('favorites')) : [])

/**
 * 更新收藏夹
 * @param type [STRING] 添加|删除
 * @param img 图片对象信息
 */
export const updateFavorites = (type: string, img: ImgType) => {
   if (type === 'add') {
      useFavorites.push(img)
   } else {
      useFavorites.forEach((item: ImgType, index: number) => {
         if (item.url === img.url) return useFavorites.splice(index, 1)
      })
   }
   if (useFavorites.length === 0) {
      uni.removeStorage({key:'favorites'})
   } else {
      uni.setStorageSync('favorites', encryptData(useFavorites))
   }
}

export const initFavorite = ()  => {
   useFavorites = uni.getStorageSync('favorites') ? decryptData(uni.getStorageSync('favorites')) : []
}