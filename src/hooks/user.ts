import { encryptData, decryptData } from '@/utils'
import type { UserType } from "@/type"

const initUser = {
   id: null,
   uname: '',
   nickname: '',
   avatar: '',
   userIntegral: null
}

/**用户信息 */
export const useUserinfo = ref<UserType>(uni.getStorageSync('USER_INFO') ? decryptData(uni.getStorageSync('USER_INFO')) : initUser)
/**
 * 初始化用户数据
 * @returns 
 */
export const initUserInfo = () => {
   if(useUserinfo.value.id) return
   useUserinfo.value = uni.getStorageSync('USER_INFO') ? decryptData(uni.getStorageSync('USER_INFO')) : initUser
}
/**
 * 存储用户信息
 * @param data 用户信息
 */
export const updateUserInfo = (data: UserType) => {
   if (!data.id) return console.error('存储的用户信息不完整，请检查存储的用户信息数据！')
   useUserinfo.value = data
   uni.setStorageSync('USER_INFO', encryptData(data))
}

/**
 * 获取用户积分
 * @returns 用户积分
 */
export const getUserInfoVal = (key: string) => {
   initUserInfo()
   if (!useUserinfo.value[key] && useUserinfo.value[key] !== 0 ) return console.error('用户积分获取失败,请检查存储用户信息的参数是否完整！')
   return useUserinfo.value[key]
}

/**
 * 更新用户信息的某个属性
 * @param key 属性名
 * @param val 属性值
 */
export const updateUserInfoItem = (key: 'id' | 'uname'|'nickname'|'avatar'|'userIntegral', val: string | number) => {
   initUserInfo()
   useUserinfo.value[key] = (val) as never
   uni.setStorageSync('USER_INFO', encryptData(useUserinfo.value))
}