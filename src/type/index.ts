/**
 * 轮播图的类型定义
 */
export interface BannerType {
   file: string // 图片地址
   path?: string // 跳转连接
   title?: string // 标题
   describe?: string // 描述信息
   url?: string // 完整链接
}

// 单项专栏类型
export interface ColumnType {
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