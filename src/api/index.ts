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