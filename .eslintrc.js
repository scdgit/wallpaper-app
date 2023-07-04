// .eslintrc.js
module.exports = {
   root: true,
   env: {
     browser: true,
     node: true,
     es6: true
   },
   parser: 'vue-eslint-parser',
   parserOptions: {
     parser: '@typescript-eslint/parser',
     ecmaVersion: 2020,
     sourceType: 'module',
     jsxPragma: 'React',
     ecmaFeatures: {
       jsx: true,
       tsx: true
     }
   },
   plugins: ['@typescript-eslint', 'prettier', 'import'],
   extends: [
     'eslint:recommended',
     'plugin:@typescript-eslint/recommended',
     'plugin:vue/vue3-recommended',
     'prettier'
   ],
   overrides: [
     {
       files: ['*.ts', '*.tsx', '*.vue'],
       rules: {
         'no-undef': 'off',
         // 关闭vue组件名使用多单词的驼峰命名规范
         "vue/multi-word-component-names": "off",
         // 关闭vue组件上定义属性禁止使用驼峰名字规范
         "vue/attribute-hyphenation": "off",
         // 关闭函数参数定义any或不定义类型时的警告
         "@typescript-eslint/no-explicit-any": "off",
         "vue/first-attribute-linebreak": "off",
         // 关闭空函数语法检查的错误
         "@typescript-eslint/no-empty-function": "off",
         "vue/component-name-in-template-casing": "off"
       }
     }
   ],
   rules: {
     'no-unused-vars': ['error', { varsIgnorePattern: '.*', args: 'none' }],
     '@typescript-eslint/no-unused-vars': 'off',
     'vue/component-name-in-template-casing': [
       'error',
       'kebab-case',
       {
         registeredComponentsOnly: false,
         ignores: []
       }
     ],
     'vue/prop-name-casing': ['error', 'camelCase'],
     'vue/require-v-for-key': 'error',
     'vue/no-use-v-if-with-v-for': [
       'error',
       {
         allowUsingIterationVar: false
       }
     ],
     'vue/v-bind-style': ['error', 'shorthand'],
     'vue/v-on-style': ['error', 'shorthand'],
     'no-useless-escape': 0
   }
 }