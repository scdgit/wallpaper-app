import { decryptData, encryptData } from '@/utils'
import type { BookType } from '@/type'
import { novelCurrentPageContent } from '@/api'

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
