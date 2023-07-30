/**
 * 清除用户基本数据
 */
export const clearUserData = () => {
   uni.removeStorageSync('DATABASE')
   uni.removeStorageSync('deviceType')
   uni.removeStorageSync('NOVELS')
   uni.removeStorageSync('EXPANSIONAPI')
   uni.removeStorageSync('COLLECT_BOOKS')
}