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