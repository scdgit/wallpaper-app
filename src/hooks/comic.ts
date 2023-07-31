
import { comicMainJsonApi } from '@/api'
import type { ComicFavoritesItemType, ChapterActiveType } from '@/type'
import { encryptData, decryptData } from '@/utils'

/**漫画基本数据 */
export const useComicMainJson = ref({
   title: '',
   comicName: [],
   total: 0
})
/**初始化漫画基础数据 */
export const initComicMainJson = () => {
   return new Promise((resolve, reject) => {
      if (useComicMainJson.value.title) resolve(true)
      comicMainJsonApi().then((res: any) => {
         useComicMainJson.value = res.data
         resolve(true)
      }).catch(err => reject(err))
   })
}

/**漫画收藏列表 */
export const useComicFavorites = ref<Array<ComicFavoritesItemType>>(uni.getStorageSync('COLECT_COMIC') ? decryptData(uni.getStorageSync('COLECT_COMIC')) : [])
/**
 * 更新漫画收藏夹 
 * */
export const initComicFavorites = () => {
   useComicFavorites.value = uni.getStorageSync('COLECT_COMIC') ? decryptData(uni.getStorageSync('COLECT_COMIC')) : []
}
/**
 * 收藏一部漫画(收藏)
 * @param target 要收藏的漫画对象
 * @returns 
 */
export const insertComicToFavorites = (target: ComicFavoritesItemType) => {
   if (!target.bookname) {
      uni.showToast({ title: '收藏出错', icon: 'error' })
      console.error('传入的target为空')
      return
   }
   if (useComicFavorites.value.length <= 0) initComicFavorites()
   // 查重
   const isHave = useComicFavorites.value.find((ele) => JSON.stringify(ele) === JSON.stringify(target))
   if (isHave) return uni.showToast({ title: '不能重复收藏', icon: 'error' })
   // 添加到收藏列表
   useComicFavorites.value.push(target)
   uni.setStorageSync('COLECT_COMIC', encryptData(useComicFavorites.value))
   uni.showToast({ title: '已收藏' })
}
/**
 * 将漫画从收藏夹中移出(取消收藏)
 * @param target 要移出的漫画
 * @returns
 */
export const removeComicFromFavorites = (target: ComicFavoritesItemType) => {
   if (!target.bookname) {
      uni.showToast({ title: '取消出错', icon: 'none' })
      console.error('传入的target为空')
      return
   }
   if (useComicFavorites.value.length <= 0) initComicFavorites()
   useComicFavorites.value = useComicFavorites.value.filter((ele) => {
      return JSON.stringify(ele) !== JSON.stringify(target)
   })
   if (useComicFavorites.value.length <= 0) {
      uni.removeStorageSync('COLECT_COMIC')
   } else {
      uni.setStorageSync('COLECT_COMIC', encryptData(useComicFavorites.value))
   }
}

/**漫画选中的章节 */
export const useChapterActive = ref<Array<ChapterActiveType>>(uni.getStorageSync('CHAPTER_ACTIVE') ? decryptData(uni.getStorageSync('CHAPTER_ACTIVE')) : [])
/**
 * 初始化选中的章节
 */
export const initChapterActive = () => {
   if (useChapterActive.value.length > 0) return
   useChapterActive.value = uni.getStorageSync('CHAPTER_ACTIVE') ? decryptData(uni.getStorageSync('CHAPTER_ACTIVE')) : []
}
/**
 * 存储选中的漫画章节
 * @param obj 存储选中的章节信息
 * @returns 
 */
export const saveChapterActive = (obj: ChapterActiveType) => {
   if (!obj.bookname) {
      console.error('传入的target为空')
      return
   }
   initChapterActive()
   console.log(useChapterActive.value)
   useChapterActive.value.push(obj)
   uni.setStorageSync('CHAPTER_ACTIVE', encryptData(useChapterActive.value))
}

/**
 * 判断该漫画是否记录过章节内容
 * @param target 漫画章节
 * @returns 章节对象
 */
export const findActiveChapter = (bookname: string): ChapterActiveType => {
   initChapterActive()
   const findRes = useChapterActive.value.find((ele: ChapterActiveType) => {
      return ele.bookname === bookname
   })
   return findRes
}
