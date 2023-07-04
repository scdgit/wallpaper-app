import { JSON_URL, KEY } from '@/config'
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
	const r = getRandomNumber(0,255)
	const g = getRandomNumber(0,255)
	const b = getRandomNumber(0,255)
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