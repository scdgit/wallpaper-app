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
   file: string // 文件名
   describe: string // 描述
   tag: string // 标签
   ratio: number // 比例
   height?: number
   width?: number
   room?: string // 存放图片的目录
   url?: string // 图片地址
   love?: number // 收藏数
}

// 图片预览中上一张和下一张的类型
export interface PreAndNextType {
   pre: ImgType
   next: ImgType
}