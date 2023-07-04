import { JSON_URL, KEY, WEB_IMG_API } from '@/config'

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
   const r = getRandomNumber(0, 255)
   const g = getRandomNumber(0, 255)
   const b = getRandomNumber(0, 255)
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
 * 加载指定文件夹下的图片资源
 * @param room 图片仓库对应的一级目录
 * @param start 开始加载的图片索引
 * @param num 需要加载的数量
 * @returns [{$room:[base64]}] 加载后的返回数据
 */
export function loadJsonData(room: string): Promise<[string]> {
   return new Promise((resolve, reject) => {
      uni.request({
         url: `${JSON_URL}/main.json`,
         headers: {
            'Content-Type': 'application/json'
         },
         success(result: any) {
            resolve(result.data[room])
         },
         fail(err) {
            reject(err)
         },
      })
   })
}

/**
 * 加密函数
 * @param data 需要加密的数据
 * @param key 加密秘钥
 * @returns 加密之后的数据
 */
export function encryptData(data: any) {
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
   uni.showLoading({title: '下载中...'})
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
                     uni.showToast({title: '已保存'})
                     resolve({msg: 'download:ok', path: saveRes.path})
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
               reject({msg:'download:failed'})
               frag1 = true
            }
         },
         fail: () => {
            uni.hideLoading()
            reject({msg:'download:failed'})
            uni.showToast({ title: '网络错误', icon: 'error' })
            frag1 = true
         }
      })
   })
}