// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

console.log('正在读取您的配置 >>>> 测试环境'); // 打包提示 别删

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
   plugins: [
    '@umijs/plugin-antd',
    '@umijs/plugin-dva',
    '@umijs/plugin-locale',
    '@umijs/plugin-esbuild',
    '@umijs/plugin-qiankun',
  ],
  define: {
    'process.env': {
      BUILD_ENV: 'test',
      A_KEY: '59,61,59,61,6e,67,57,65,62,',
      B_KEY: '50,61,72,61,6d,37,37',
      pKey: "59,61,59,61,6e,67,43,50,",
      bKey: "45,43,43,57,4d,37,37,37",
      T_s: '33,34,65,38,',
      T_c: '62,63,64,38,31,37,',
      T_e: '64,65,62,32,35,62',
    },
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    // {
    //   path: '/',
    //   redirect: '/contract/income',
    //   authority: ['B15', 'S15'],
    //   component: '../layouts/BlankLayout'
    // },
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'login',
          path: '/user/login',
          component: './loginNew',
        },
      ],
    },
    ...routes
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy['dev'],
  manifest: {
    basePath: '/',
  },
  base: '/',
  publicPath: '/',
  // base:'/',
  mock: {},
  // 快速刷新功能 https://umijs.org/config#fastrefresh
  // fastRefresh: {},
  esbuild: {},
  webpack5: {},
  qiankun: {
    slave: {},
  },
  chainWebpack(memo) {
    memo.module
      .rule('mjs')
      .test(/\.m?js$/)
      .resolve.set('fullySpecified', false);
  },
  // 其他配置...
  extraPostCSSPlugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],

});
