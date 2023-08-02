/**
 * 携带Tooken的HTTP请求
 * @param type ['GET' | 'POST] 请求类型
 * @param url [string] 请求地址
 * @param params [object] 请求参数
 * @returns Promise
 */
export const tokenRequest = (type: 'GET' | 'POST', url: string, params: object): Promise<any> => {
   let options: any
   if (type === 'GET') {
      let str = '?'
      for (const key in params) {
         str += `${key}=${params[key]}&`
      }
      str = str.slice(0, str.length - 1)
      options = { url: url + str, method: 'GET' }
   } else {
      options = { url, method: 'POST', data: params }
   }
   return (uni.request({
      header: {
         'authorization': `Bearer ${uni.getStorageSync('TOKEN')}`
      },
      ...options
   })) as any
}