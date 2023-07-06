import { JSON_URL, BASE_URL } from '@/config'
import { ImgType } from '@/type'
/**
 * 获取指定分类中的json数据
 * @param room 分类对应的json文件名
 * @returns [OBJECT]
 */
export const getJsonColumnData = (file: string): Promise<{title: string, list: Array<ImgType>}> => {
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
 * 加载指定文件夹下的图片资源
 * @param room 图片仓库对应的一级目录
 * @param start 开始加载的图片索引
 * @param num 需要加载的数量
 * @returns [{$room:[base64]}] 加载后的返回数据
 */
export function loadJsonData(room: string): Promise<Array<ImgType>> {
   return new Promise((resolve, reject) => {
      uni.request({
         url: `${JSON_URL}/main.json`,
         headers: {
            'Content-Type': 'application/json'
         },
         success(result: any) {
            result.data[room].forEach((element: ImgType )=> {
               element.url = `${BASE_URL}/${room}/${element.file}`
            });
            resolve(result.data[room])
         },
         fail(err) {
            reject(err)
         },
      })
   })
}