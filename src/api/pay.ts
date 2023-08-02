// 创建订单的参数类型
interface createOrderType {
   totalAmount: string // 订单金额
   orderIntegral: number // 订单积分
   uId: number // 支付者ID
   orderTime: number // 创建订单的时间戳
}
/**
 * 创建订单
 * @returns Promise
 */
export const createOrderApi = (params: createOrderType) => {
   return uni.request({
      url: '/api/payment/inPerson',
      method: 'POST',
      header: {
         'authorization': `Bearer ${uni.getStorageSync('TOKEN')}`
      },
      data: params
   })
}

// 订单查询参数类型
interface queryOrderType {
   outTradeNo: string // 订单号
   orderIntegral: number // 订单积分
   uId: number // 当前账号的ID
}
/**
 * 解析订单是否支付成功
 * @param outTradeNo 订单号
 * @param tradeNo 商户号
 * @param orderIntegral 订单积分
 * @param uId 用户ID
 * @returns Promise
 */
export const queryPayOrderApi = (params: queryOrderType) => {
   return uni.request({
      url: '/api/payment/queryOrder',
      method: 'POST',
      header: {
         'authorization': `Bearer ${uni.getStorageSync('TOKEN')}`
      },
      data: params
   })
}