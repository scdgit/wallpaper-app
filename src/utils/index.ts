import { KEY, WEB_IMG_API } from '@/config'
import { useDeviceType } from '@/hooks'

/**
 * 获取一个指定范围的随机数
 * @param: star NUMBER 开始
 * @param: end NUMBER 结束
 * @return STRING 返回范围内的随机数字
 * */
export function getRandomNumber(star: number, end: number) {
   return Math.ceil(Math.random() * end + star)
}

/**
 * 获取一个随机颜色
 * @param opcity [NUMBER] 透明度[小数]
 * @returns [STRING]
 */
export function randomColor(opcity?: number) {
   let color: string
   const r = getRandomNumber(0, 128)
   const g = getRandomNumber(0, 128)
   const b = getRandomNumber(0, 128)
   if (opcity) {
      color = `rgba(${r},${g},${b},${opcity})`
   } else {
      color = `rgb(${r},${g},${b})`
   }
   return color
}

/**
 * 获取DOM元素的属性值
 * @param selector 选择器
 * @param prop 属性
 * @returns 对应属性的值
 */
export function elementStyle(selector: string, prop: string) {
   return new Promise((resolve) => {
      nextTick(() => {
         uni.createSelectorQuery()
            .select(selector)
            .boundingClientRect((rect: any) => {
               if (rect) {
                  resolve(rect[prop])
               } else {
                  // 小程序端
                  resolve(null)
               }
            }).exec()
      })
   })
}

/**
* 调用拍照接口并返回数据[Promise风格]
* */
export function chooseImage(sourceType: string) {
   return uni.chooseImage({
      sourceType: [sourceType]
   })
}

/**
 * 加密函数
 * @param data 需要加密的数据
 * @param key 加密秘钥
 * @returns 加密之后的数据
 */
export function encryptData(data: any) {
   if (!data) return
   const str = JSON.stringify(data)
   let encryptedStr = '';
   for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length);
      encryptedStr += String.fromCharCode(charCode);
   }
   return encryptedStr;
}

/**
 * 解密函数
 * @param encryptedData 需要解密的数据
 * @param key 解密的秘钥
 * @returns 解密之后的数据
 */
export function decryptData(encryptedData: string) {
   if (!encryptedData) return
   let decryptedStr = '';
   for (let i = 0; i < encryptedData.length; i++) {
      const charCode = encryptedData.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length);
      decryptedStr += String.fromCharCode(charCode);
   }
   return JSON.parse(decryptedStr);
}

/**
 * 保存图片到相册中
 * @param url [STRING] 图片的地址链接
 * @return [OBJECT]
 */
let frag1 = false
export function saveImgToAlbum(url: string): Promise<object> {
   if (frag1 === true) return
   if (uni.getStorageSync('deviceType') === 'web') {
      url = url.replace('http://x006.b.u8s.ru', WEB_IMG_API)
      const aLink = document.createElement('a')
      aLink.href = url
      aLink.download = url.slice(url.lastIndexOf('/') + 1)
      aLink.click()
      return
   }
   frag1 = true
   uni.showLoading({ title: '下载中...' })
   return new Promise((resolve, reject) => {
      uni.downloadFile({
         url: url,
         success: (res: any) => {
            console.log(res)
            if (res.statusCode === 200) {
               uni.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: (saveRes) => {
                     uni.hideLoading()
                     uni.showToast({ title: '已保存' })
                     resolve({ msg: 'download:ok', path: saveRes.path })
                     frag1 = true
                  },
                  fail: () => {
                     uni.hideLoading()
                     frag1 = true
                  }
               })
            } else {
               uni.hideLoading()
               uni.showToast({ title: '下载失败', icon: 'error' })
               reject({ msg: 'download:failed' })
               frag1 = true
            }
         },
         fail: () => {
            uni.hideLoading()
            reject({ msg: 'download:failed' })
            uni.showToast({ title: '网络错误', icon: 'error' })
            frag1 = true
         }
      })
   })
}

/**
 * 预览文档
 * @param url [STRING] 文档地址链接(doc, xls, ppt, pdf, docx, xlsx, pptx)
 */
export async function documentPreview(url: string) {
   uni.showLoading({ title: '加载中...' })
   uni.downloadFile({
      url: url,
      success: function (res) {
         uni.openDocument({
            filePath: res.tempFilePath,
            showMenu: true,
            success: function () {
               uni.hideLoading()
            }
         });
      }
   });
}

/**
 * 获取底部导航tabbar的高度
 * @returns STRING
 */
export function getTabbarH() {
   const systemInfo = uni.getSystemInfoSync();
   const tabBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - systemInfo.statusBarHeight;
   return tabBarHeight
}

/**
 * 获取顶部导航的高度
 * @returns 
 */
export function getNavigationH() {
   const systemInfo = uni.getSystemInfoSync();
   const statusBarHeight = systemInfo.statusBarHeight || 0;
   const defaultNavBarHeight = systemInfo.platform === 'ios' ? 44 : 48;
   const navigationBarHeight = statusBarHeight + defaultNavBarHeight;
   return navigationBarHeight
}

/**
 * 获取页面可视区域的高度
 * @returns 页面中间可视区域的高度
 */
export const getWindowHeight = (): Promise<number> => {
   return new Promise((resolve, reject) => {
      let H: number
      uni.getSystemInfo({
         success: (res) => {
            H = res.windowHeight - 50
            resolve(H)
         },
         fail: err => {
            reject(err)
         }
      })
   })
}

/**
 * 获取目标对象结构层级中的数据
 * @param obj [object] 目标对象
 * @param str [string] 对象层级结构 data/url -> Object[data][url]
 * @return [any] 目标数据
 */
export const targetObjData = (obj: object, target: string): string => {
   const attrArr = target.split('/')
   attrArr.forEach((att: string) => {
      obj = obj[att]
   })
   return obj + ''
}

/**
 * 获取不同设备下的请求地址
 * @param path 请求接口地址(包含/)
 * @returns url
 */
export const getUrl = (path: string): string => {
   let url: string
   if (useDeviceType === 'web') {
      url = `${WEB_IMG_API}/img${path}`
   } else {
      url = `http://x006.b.u8s.ru/img${path}`
   }
   return url
}

/**
 * 加载一张图片
 * @param url
 * @returns 
 */
export const loadOneImg = (url: string): Promise<boolean> => {
   return new Promise((reslove, reject) => {
      uni.request({
         url,
         success: () => reslove(true),
         fail: () => reject(false)
      })
   })
}

/**
 * 格式化时间戳
 * @param timestamp 
 * @returns 
 */
export const formatTimestamp = (timestamp: number) => {
   const date = new Date(timestamp);
   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   const hours = date.getHours();
   const minutes = date.getMinutes();
   const seconds = date.getSeconds();

   const formattedDate = year + '年' + month + '月' + day + '日' + formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);

   return formattedDate;
}
function formatTime(time) {
   return time < 10 ? '0' + time : time;
}