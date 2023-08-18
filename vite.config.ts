// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [uni(),
   // 自动导入vue3 setup的API，如需要手动导入
   AutoImport({
      include: [
         /.[tj]sx?$/, // .ts, .tsx, .js, .jsx
         /.vue$/,
         /.vue?vue/, // .vue
         /.md$/ // .md
      ],
      dts: 'src/auto-imports.d.ts', // 安装好依赖后，重新运行编译即可自动在根目录下生成此声明文件
      imports: ['vue', 'uni-app', 'pinia'],
      eslintrc: {
         enabled: true, // Default `false`
         filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
         globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
   }),
   // 自动加载svg
   createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
   })
   ],
   resolve: {
      // 设置路径别名
      alias: {
         '@': path.resolve(__dirname, 'src'),
         '@static': path.resolve(__dirname, 'src/static'),
      },
   },
   // 配置代理
   server: {
      proxy: {
         '/imgapi': {
            target: 'http://xxxx.ru',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/imgapi/, '')
         },
         '/expansion1': {
            target: 'https://xxxx.vip',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/expansion1/, '')
         },
         '/api': {
            target: 'http://127.0.0.1:5000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
         },
      }
   }
})
