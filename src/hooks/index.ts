import { decryptData, encryptData } from '@/utils'
import type { ImgType, BookType } from '@/type'
import { novelCurrentPageContent } from '@/api'

// 收藏夹中的数据
export let useWallFavorites = reactive<Array<ImgType>>([])
/**
 * 初始化收藏夹
 */
export const initWallpaper = () => {
   useWallFavorites = uni.getStorageSync('wallpaper') ? decryptData(uni.getStorageSync('wallpaper')) : []
   return useWallFavorites
}
/**
 * 更新收藏夹
 * @param type [STRING] 添加|删除
 * @param img 图片对象信息
 */
export const updateWallpaper = (type: string, img: ImgType) => {
   if (type === 'add') {
      const target: any = useWallFavorites.find(item => item.file === img.file)
      if (target) return
      useWallFavorites.push(img)
   } else {
      // 删除item
      useWallFavorites.forEach((item: ImgType, index: number) => {
         if (item.url === img.url) {
            return useWallFavorites.splice(index, 1)
         }
      })
   }
   if (useWallFavorites.length === 0) {
      uni.removeStorage({ key: 'wallpaper' })
   } else {
      uni.setStorageSync('wallpaper', encryptData(useWallFavorites))
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
export const useDeviceType: string = uni.getStorageSync('deviceType')


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
export let useNovels = reactive<Array<BookType>>([])
// 初始化小说列表
export const initNovels = () => {
   useNovels = uni.getStorageSync('NOVELS').books
}
/* 小说起始页数据 */
export const useBookStartContent = ref<string>('')
/**
 * 获取指定页码的书本内容
 * @param bookname[string] 书名
 * @param num[number] 第几页
 * @returns 内容
 */
export const initBookDetailContent = (bookname: string, num = 1): Promise<boolean> => {
   return new Promise((resolve, reject) => {
      novelCurrentPageContent(Number(num), bookname).then(data => {
         useBookStartContent.value = data
         resolve(true)
      }).catch(err => reject(false))
   })
}

// 收藏书本
export let useCollectBooks = reactive<Array<BookType>>([])
// 初始化书本收藏列表
export const initCollectBooks = () => {
   useCollectBooks = uni.getStorageSync('COLLECT_BOOKS') ? decryptData(uni.getStorageSync('COLLECT_BOOKS')) : []
   return useCollectBooks
}
// 判断有没有收藏该书
export const isHaveCollectThisBook = (book: BookType) => {
   if (useCollectBooks.length <= 0) initCollectBooks()
   return useCollectBooks.find((item: BookType) => book.bookname === item.bookname)
}
// 收藏书本
export const collectBook = (book: BookType) => {
   if (useCollectBooks.length <= 0) initCollectBooks()
   const target = useCollectBooks.find((ele: BookType) => book.bookname === ele.bookname)
   if (!target) {
      useCollectBooks.push(book)
      uni.setStorageSync('COLLECT_BOOKS', encryptData(useCollectBooks))
      uni.showToast({ title: '已收藏', icon: 'none' })
   }
}
// 取消收藏
export const cancelCollectBook = (book: BookType) => {
   console.log(book)
   if (useCollectBooks.length <= 0) initCollectBooks()
   console.log(useCollectBooks)
   useCollectBooks = useCollectBooks.filter((item: BookType) => {
      return item.bookname !== book.bookname
   })
   uni.setStorageSync('COLLECT_BOOKS', encryptData(useCollectBooks))
   uni.showToast({ title: '取消收藏', icon: 'none' })
}
