import { decryptData, encryptData } from '@/utils'
import type { ImgType } from '@/type'
import { reactive } from 'vue'

// 收藏夹中的数据
export let useFavorites = reactive<Array<ImgType>>([])
/**
 * 初始化收藏夹
 */
export const initFavorite = () => {
   useFavorites = uni.getStorageSync('favorites') ? decryptData(uni.getStorageSync('favorites')) : []
}
/**
 * 更新收藏夹
 * @param type [STRING] 添加|删除
 * @param img 图片对象信息
 */
export const updateFavorites = (type: string, img: ImgType) => {
   if (type === 'add') {
      const target: any = useFavorites.find(item => item.file === img.file)
      if (target) return
      useFavorites.push(img)
   } else {
      // 删除item
      useFavorites.forEach((item: ImgType, index: number) => {
         if (item.url === img.url) {
            return useFavorites.splice(index, 1)
         }
      })
   }
   if (useFavorites.length === 0) {
      uni.removeStorage({ key: 'favorites' })
   } else {
      uni.setStorageSync('favorites', encryptData(useFavorites))
   }
}

// 供上下滑动图片所存储的数据
export let usePreviewData = reactive<Array<ImgType>>([])
/**
 * 初始化预览上下滑动的所有数据
 * @param data 瀑布流数据
 */
export const initPreviewData = (data: Array<ImgType>) => {
   usePreviewData = data
}
/**
 * 找出对应预览图片的下标
 * @param target 图片对象
 * @returns 数组下标
 */
export const previewTargetIndex = (target: ImgType): number => {
   let index: number
   usePreviewData.forEach((item: ImgType, i: number) => {
      if (item.file === target.file) {
         return index = i
      }
   })
   return index
}