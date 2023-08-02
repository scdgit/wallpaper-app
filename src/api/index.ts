import { JSON_URL, BASE_URL, PROXY_API, WEB_IMG_API } from '@/config'
import { ImgType } from '@/type'
import { useDeviceType } from '@/hooks'
import { getUrl } from '@/utils'
/**
 * 获取指定分类中的json数据
 * @param room 分类对应的json文件名
 * @returns [OBJECT]
 */
export const getJsonColumnData = (file: string): Promise<{ title: string, list: Array<ImgType> }> => {
   return new Promise((resolve, reject): any => {
      uni.request({
         url: `${JSON_URL}/${file}`,
         success: (result: any) => {
            result.data.list.forEach((element: ImgType) => {
               element.url = `${BASE_URL}/${file.split('/')[0].split('.')[0]}/${element.file}`
            });
            resolve({
               title: result.data.title,
               list: result.data.list
            })
         },
         fail: (err) => {
            reject(err)
         }
      })
   })
}

/**
 * 获取基本数据
 * @returns main.json文件中的数据
 */
export const initMainJsonData = () => {
   return new Promise((resolve, reject) => {
      uni.request({
         url: `${JSON_URL}/main.json`,
         success: (res: any) => {
            res.data.banner.forEach((element: ImgType) => {
               element.url = `${BASE_URL}/banner/${element.file}`
            });
            uni.setStorageSync('DATABASE', res.data)
            resolve(res.data)
         },
         fail: (err) => {
            reject(err)
         }
      })
   })
}

/**
 * 获取扩展接口数据
 * @returns 
 */
export const getExpansionApi = () => {
   return uni.request({
      url: `${JSON_URL}/expansion-api.json`
   })
}

/**
 * 获取小说json文件数据
 * @returns 小说json列表数据
 */
// 过滤简介中的无用字符
export const getNovelData = () => {
   // 请求小说文字
   return new Promise((resolve: any, reject: any) => {
      let url = `${BASE_URL}/books/novel.json`
      if (useDeviceType === 'web') {
         url = '/imgapi/img/books/novel.json'
      }
      uni.request({
         url: url,
         success: (res: any) => {
            for (const book of res.data.books) {
               book.bg = `${BASE_URL}/books/${book.bg}`
               book.introduction = book.introduction.replace(/[\s：\n]/g, '')
            }
            resolve(res.data)
         },
         fail: (err) => {
            reject(err)
         }
      })
   })
}

/**
 * 获取小说页码数据
 * @param num 第几页
 * @param bookname 书名
 * @returns 指定页码的数据
 */
export const novelCurrentPageContent = (num: number, bookname: string): Promise<string> => {
   let url = `${BASE_URL}/books/${bookname}_${num}.txt`
   if (useDeviceType === 'web') url = `${PROXY_API}/img/books/${bookname}_${num}.txt`
   return new Promise((resolve, reject) => {
      uni.request({
         url: url,
         method: 'GET',
         success: (res: any) => {
            setTimeout(() => { resolve(res.data) }, 3000)
         },
         fail: (err) => {
            reject(err)
         }
      })
   })
}

/**
 * 登录用户
 * @param uname 用户名
 * @param password 密码
 */
export const loginApi = (uname: string, password: string) => {
   return uni.request({
      url: `/api/user/login`,
      method: 'POST',
      data: { uname, password }
   })
}

/**
 * 注册用户
 * @param uname 用户名
 * @param password 密码
 * @returns
 */
export const registerApi = (uname: string, password: string, email: string) => {
   return uni.request({
      url: '/api/user/register',
      method: 'POST',
      data: { uname, password, email }
   })
}

/**
 * 获取漫画基本JSON文件
 * @returns Promise
 */
export const comicMainJsonApi = () => {
   let url = ''
   if (useDeviceType === 'web') url = `${WEB_IMG_API}/img/comic/comic.json`
   else url = 'http://x006.b.u8s.ru/img/comic/comic.json'
   return uni.request({ url: url })
}

/**
 * 获取对应漫画的JSON文件
 * @param bookname 漫画名称
 * @returns Promise
 */
export const comicDetailJsonApi = (bookname: string): Promise<any> => {
   if (!bookname) return uni.showToast({ title: 'bookname不能为空' })
   return uni.request({
      url: getUrl(`/comic/${bookname}/main.json`)
   })
}