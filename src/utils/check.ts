// 订单号校验正则
const uuidV4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
/**
 * 订单号校验，是否由本系统生成的订单号
 * @param orderNumber 订单号
 * @returns 
 */
export const validateOrderNumber = (orderNumber: string) => {
  return uuidV4Regex.test(orderNumber)
}