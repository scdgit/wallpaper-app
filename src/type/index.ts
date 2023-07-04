/**
 * 轮播图的类型定义
 */
export interface BannerType {
   file: string // 图片地址
   path?: string // 跳转连接
   title?: string // 标题
   describe?: string // 描述信息
}

// 单项专栏类型
export interface columnType {
   title: string
   room: string
}

// 图片对象
export interface ImgType {
   file: string
   describe: string
   tag: string
   height?: string
   width?: string
   room?: string
   url?: string
}