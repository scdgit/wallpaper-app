/**
 * 轮播图的类型定义
 */

// 单项专栏类型
export interface ColumnType {
   title: string
   room: string
}

// 图片对象
export interface ImgType {
   file: string // 文件名
   describe: string // 描述
   tag: string // 标签
   ratio: number // 比例
   height?: number
   width?: number
   room?: string // 存放图片的目录
   url?: string // 图片地址
   love?: number // 收藏数
   avatar?: string // 上传者头像
   nickname?: string // 上传者昵称
}

// 扩展功能api的类型
export interface ExpansionApisType {
   title: string // 接口标题
   icon?: string // 图标
   host: string // 主机
   api: string // 接口请求地址
   proxy: string // 代理地址
   method: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' // 请求类型
   target: string // 目标属性
}

// 书本类型
export interface BookType {
   author: string // 作者
   bg: string // 背景图片
   bookname: string // 书名
   chapters: number // 章节数
   introduction: string // 简述
   numberOfFiles: number // 全部页数
}

// 用户类型
export interface UserType {
   id: number
   uname: string
   nickname: string
   avatar: string
   userIntegral: number // 积分
}

// 漫画章节类型
export interface ComicChapterType {
   title: string // 章节标题
   total: number // 章节图片总数
   num: string // 存放的目录
   bookname?: string // 漫画名称
   charterTotalNum?: number // 总章节数
}
// 漫画对象类型
export interface ComicType {
   bookname: string // 漫画名称
   author: string // 作者
   introduction: string // 漫画简介
   chapter: [] | [ComicChapterType], // 漫画所有章节
   total: number // 总章节数
   cover?: string // 封面
}
// 漫画收藏夹的类型
export interface ComicFavoritesItemType {
   bookname: string // 漫画名称
   author: string // 作者
}
// 选中章节的类型
export interface ChapterActiveType {
   bookname: string
   active: number
}

// 订单参数类型
export interface orderType {
   total_amount: string // 订单金额
   out_trade_no: string // 订单号
   trade_no?: string // 商户号
   qr_code: string // 二维码
   u_id: number // 支付者ID
   order_integral: number // 订单积分
   order_time: number // 订单创建时间戳
}