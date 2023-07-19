import { decryptData, encryptData } from '@/utils'
import type { ImgType, BookType } from '@/type'
import { novelCurrentPageContent } from '@/api'

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

// 存储设备类型
export const useDeviceType = uni.getStorageSync('deviceType')


/**
 * 跳转到预览界面
 * @param previewData 预览的全部数据
 * @param currImg 当前预览的图片对象
 * @param livekeep 是否在跳转后关闭当前页面
 */
export const goToPreview = (previewData: Array<ImgType>, currImg: ImgType, livekeep?: boolean) => {
   let pre_path: string
   if (livekeep) {
      const pages = getCurrentPages()
      // 记录被关闭的这个页面路由
      pre_path = '/' + pages[pages.length - 1].route
   }
   initPreviewData(previewData)
   uni.navigateTo({
      url: `/subpackage/wallpaper?img=${encryptData(currImg)}&pre_path=${pre_path}`
   })
}

// 小说列表
export const useNovels: Array<BookType> = uni.getStorageSync('NOVELS').books
// 小说起始页数据
export let useBookStartContent: string
export const initBookDetailContent = (bookname: string) => {
   return new Promise((resolve, reject) => {
      novelCurrentPageContent(1, bookname).then(data => {
         useBookStartContent = data
         resolve(true)
      }).catch(err => reject(err))
   })
}