/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // '/api/': {
    //   // target: 'https://test.swpm.top/', // 开发人员专用
    //   // target: 'http://123.6.230.136/', // 开发人员专用 测试域名不需要放开pathRewrite
    //   target: 'https://dev.yayangsoft.com/',
    //   changeOrigin: true,
    //   // pathRewrite: { '^/api': '' }, // 连接正式服务器不需要反向代理，注掉这里
    //   secure: false,
    // },
    '/api/apiGateway/': {
      // target: 'https://test.swpm.top/', // 开发人员专用
      target: 'https://dev.yayangsoft.com/', // 开发人员专用 测试域名不需要放开pathRewrite
      changeOrigin: true,
      // pathRewrite: { '^/api': '' }, // 连接正式服务器不需要反向代理，注掉这里
      secure: false,
    },
     '/api/ZyyjIms/': {
      // target: 'https://dev.yayangsoft.com/', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'http://192.168.10.23:9154', // 开发人员专用 测试域名不需要放开pathRewrite
      //  target: 'http://192.168.31.47:9154', // 开发人员专用 测试域名不需要放开pathRewrite
       target: 'http://192.168.10.164:9154', // 开发人员专用 测试域名不需要放开pathRewrite
       // target: 'http://192.168.10.164:9154', // 开发人员专用 测试域名不需要放开pathRewrite
       // target: 'http://localhost:9154', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'https://plat.swpm.top/', // 正式地址
      // target: 'https://fcc.swpm.top', //五建正式地址
      //  target: 'https://test.swpm.top/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }, // 连接正式服务器不需要反向代理，注掉这里
      secure: false,
    },
    '/api/basicNew/': {
      // target: 'https://dev.yayangsoft.com/', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'http://192.168.10.13:9148', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'http://192.168.10.52:8080', // 开发人员专用 测试域名不需要放开pathRewrite
      target: 'http://192.168.10.164:9130', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'https://plat.swpm.top/', // 正式地址
      // target: 'https://fcc.swpm.top', //五建正式地址
      //  target: 'https://test.swpm.top/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }, // 连接正式服务器不需要反向代理，注掉这里
      secure: false,
    },
    '/api/flow/': {
      // target: 'https://dev.yayangsoft.com/', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'http://192.168.10.13:9148', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'http://192.168.10.52:8080', // 开发人员专用 测试域名不需要放开pathRewrite
      target: 'http://192.168.10.164:10333', // 开发人员专用 测试域名不需要放开pathRewrite
      // target: 'https://plat.swpm.top/', // 正式地址
      // target: 'https://fcc.swpm.top', //五建正式地址
      //  target: 'https://test.swpm.top/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }, // 连接正式服务器不需要反向代理，注掉这里
      secure: false,
    },
    '/app/': {
      target: 'https://test.swpm.top/', // 开发人员专用
      changeOrigin: true,
      //pathRewrite: { '^/api': '' }, // 连接正式服务器不需要反向代理，注掉这里
      secure: false,
    },
    // pdf解析服务器
    '/PDFServer': {
      target: 'http://114.116.27.197:9999/',
      changeOrigin: true,
      secure: false,
    },
    '/file/aut': {
      //target: 'https://preview.pro.ant.design',
      // target: 'http://114.116.27.197:10010/',
      // target: 'http://114.115.204.211:10010/', // 正式  token 不加密
      target: 'http://49.4.11.48:10010/', // 测试   ctoken 加密
      changeOrigin: true,
      secure: false,
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
