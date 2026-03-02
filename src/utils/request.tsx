/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, Modal } from 'antd';
import { getLocale } from 'umi';
// @ts-ignore
import CryptoJS from 'crypto-js';
import { ErrorCode, PROP_KEY, SrvName } from '@/common/const';
import { getSrvName, getYYYKey } from '@/utils/utils';
import { getTS } from '@/utils/utils-date';

// 秘钥
const cEnc = CryptoJS.enc;
const cA = CryptoJS.AES;
const cmc = CryptoJS.mode.CBC;
const cpp = CryptoJS.pad.Pkcs7;
const cb4 = CryptoJS.enc.Base64;

// token二次加密密钥
export const TOKENCRYPTOJSKEY = '34e8bcd817deb25b';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  299: '请求的条件有误',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 加密
 * @param plaintText
 * @param secretKey 密钥
 */

export function encrypt(plaintText: string, secretKey?: string) {
  if (!secretKey) {
    // eslint-disable-next-line no-param-reassign
    secretKey = getYYYKey();
  }
  const key = cEnc.Utf8.parse(secretKey);
  const src = cEnc.Utf8.parse(plaintText);
  const options = {
    iv: key,
    mode: cmc,
    padding: cpp,
  };
  const encryptedData = cA.encrypt(src, key, options);
  return cb4.stringify(encryptedData.ciphertext);
}

/**
 * 解密
 * @param encryptedBase64Str
 * @param secretKey 密钥
 */
export function decrypt(encryptedBase64Str: string, secretKey?: string) {
  if (!secretKey) {
    // eslint-disable-next-line no-param-reassign
    secretKey = getYYYKey();
  }
  // eslint-disable-next-line no-useless-escape
  const vals = encryptedBase64Str.replace(/\-/g, '+').replace(/_/g, '/');
  const key = cEnc.Utf8.parse(secretKey);
  const options = {
    iv: key,
    mode: cmc,
    padding: cpp,
  };
  const decryptedData = cA.decrypt(vals, key, options);
  const decryptedStr = cEnc.Utf8.stringify(decryptedData);
  return decryptedStr;
}
/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response || { errCode: -1, result: [], rows: [], total: 0 };
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'omit', // 发送带凭据的请求
  headers: {
    token: '',
  },
});

export const getUuid = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  // @ts-ignore
  // eslint-disable-next-line no-bitwise
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  // eslint-disable-next-line no-multi-assign
  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
};

/**ƒ√
 * request拦截器, 改变url 或 options.
 */
request.interceptors.request.use((url, options) => {
  let cToken = localStorage.getItem('x-auth-token');
  let jwtToken;
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
  const dep_code = localStorage.getItem('auth-default-cpecc-depCode');
  const currDepCode = localStorage.getItem('auth-default-cpecc-currDepCode');
  const devCode = localStorage.getItem('auth-cpecc-selected-devCode');
  const dev_code = localStorage.getItem('auth-cpecc-selected-devCode');
  const currDevCode = localStorage.getItem('auth-cpecc-selected-currDevCode');
  const compCode = localStorage.getItem('auth-default-cpecc-branchCompCode');
  // 这里需要先判断一下 是否是登陆的接口 如果是 需要对密码进行加密处理
  if (!cToken && url.indexOf('basic/naut/login') > -1 && options.method === 'post') {
    const { data } = options;
    // @ts-ignore
    Object.assign(data, { pwd: encrypt(JSON.stringify(data.initPwd)) });
    // 删除加密前的密码
    delete data.initPwd;
  }
  if (cToken) {
    jwtToken = JSON.parse(decrypt(cToken)).jwtToken
    cToken = encrypt(
      JSON.stringify({ token: JSON.parse(decrypt(cToken)).jwtToken, uuid: getUuid() }),
      TOKENCRYPTOJSKEY,
    );
  }

  // 获取当前选择的语言
  const selectedLang = getLocale();
  // 因为中油是全球化的系统 所以要配置相应的时区
  const currDate = new Date();
  const tzArea = currDate.getTimezoneOffset() / 60;
  // GET请求 默认将用户当前所在的项目部编码 depCode, currDepCode 赋值到请求体中
  if (options.method === 'get') {
    if (depCode && currDepCode) {
      const { params } = options;
      const newParams = {};
      // 如果params里有depCode, currDepCode, currDevCode的话 用params里的depCode, currDepCode, currDevCode
      Object.assign(newParams, { depCode }, params);
      Object.assign(newParams, { dep_code }, params);
      Object.assign(newParams, { currDepCode }, params);
      Object.assign(newParams, { wbsCode: depCode }, params);
      Object.assign(newParams, { wbs_code: depCode }, params);
      Object.assign(newParams, { currWbsCode: currDepCode }, params);
      Object.assign(newParams, { devCode }, params);
      Object.assign(newParams, { dev_code }, params);
      Object.assign(newParams, { currDevCode }, params);
      Object.assign(newParams, { prop_key: PROP_KEY }, params);
      Object.assign(params as object, newParams, {
        random: currDate.getTime(),
        langType: selectedLang,
        tz: tzArea < 0 ? Math.abs(tzArea) : -tzArea,
        ts: getTS(),
      });
    }
  }
  // POST请求 配置相应的时区，语言参数
  if (options.method === 'post') {
    const { data, params } = options;
    if (
      options.url === '/api/pipeWelding/buss/afterWeld/aut/queryNDTTotalAutLs500' ||
      options.url === '/api/pipeWelding/buss/afterWeld/aut/queryNDTTotalAutGe500' ||
      options.url === '/api/pipeWelding/buss/afterWeld/aut/queryNDTTotalAut' ||
      options.url === '/api/pipeWelding/station/wpqr/aut/queryStationProcessCard'
    ) {
      if (options.data.exColBasis) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { params } = options;
        const newParams = {};
        // 如果params里有depCode, currDepCode, currDevCode的话 用params里的depCode, currDepCode, currDevCode
        Object.assign(newParams, { depCode }, params);
        Object.assign(newParams, { dep_code }, params);
        Object.assign(newParams, { devCode }, params);
        Object.assign(newParams, { dev_code }, params);
        Object.assign(newParams, { currDepCode }, params);
        Object.assign(newParams, { currDevCode }, params);
        Object.assign(newParams, { wbsCode: depCode }, params);
        Object.assign(newParams, { wbs_code: depCode }, params);
        Object.assign(newParams, { prop_key: PROP_KEY }, params);

        Object.assign(params as object, newParams, {
          random: currDate.getTime(),
          langType: selectedLang,
          tz: tzArea < 0 ? Math.abs(tzArea) : -tzArea,
          ts: getTS(),
          filter: options.data.filter,
          sort: options.data.sort,
          order: options.data.order,
          op: 'xlsx',
          exType: 0,
          //exColBasis: options.data.exColBasis,
        });
      } else {
        const newParams = {};
        // 如果params里有depCode, currDepCode, currDevCode的话 用params里的depCode, currDepCode, currDevCode
        Object.assign(newParams, { depCode }, params);
        Object.assign(newParams, { dep_code }, params);
        Object.assign(newParams, { devCode }, params);
        Object.assign(newParams, { dev_code }, params);
        Object.assign(newParams, { currDepCode }, params);
        Object.assign(newParams, { currDevCode }, params);
        Object.assign(newParams, { wbsCode: depCode }, params);
        Object.assign(newParams, { wbs_code: depCode }, params);
        Object.assign(newParams, { prop_key: PROP_KEY }, params);
        Object.assign(params as object, newParams, {
          random: currDate.getTime(),
          langType: selectedLang,
          tz: tzArea < 0 ? Math.abs(tzArea) : -tzArea,
          ts: getTS(),
          filter: options.data.filter,
          sort: options.data.sort,
          order: options.data.order,
        });
      }
    }
    // POST请求处理 请求是文件上传的情况 判断是否是FormData对象
    if (Object.prototype.toString.call(data) === '[object FormData]') {
      // 如果FormData有下列的参数 就用FormData里的 要是没有就用系统缓存获取的
      if (!data.get('currDepCode')) data.append('currDepCode', currDepCode);
      if (!data.get('depCode')) data.append('depCode', depCode);
      if (!data.get('dep_code')) data.append('dep_code', depCode);
      if (!data.get('currDevCode')) data.append('currDevCode', currDevCode);
      if (!data.get('devCode')) data.append('devCode', devCode);
      if (!data.get('dev_code')) data.append('dev_code', dev_code);
      if (!data.get('comp_code')) data.append('comp_code', compCode);
      if (!data.get('comp_code')) data.append('branch_comp_code', compCode);
      data.append('langType', selectedLang);
      data.append('tz', tzArea < 0 ? Math.abs(tzArea) : -tzArea);
      data.append('ts', getTS());
    } else {
      const newData = {};
      // console.log('-----------getTS', getTS());
      // 如果params里有depCode, currDepCode, currDevCode的话 用params里的depCode, currDepCode, currDevCode
      Object.assign(newData, { depCode }, data);
      Object.assign(newData, { dep_code }, data);
      Object.assign(newData, { devCode }, data);
      Object.assign(newData, { dev_code }, data);
      Object.assign(newData, { currDepCode }, data);
      Object.assign(newData, { currDevCode }, data);
      Object.assign(newData, { comp_code: compCode }, data);
      Object.assign(newData, { branch_comp_code: compCode }, data);
      Object.assign(newData, { wbsCode: depCode }, data);
      Object.assign(newData, { wbs_code: depCode }, data);
      Object.assign(newData, { prop_key: PROP_KEY }, data);
      Object.assign(data, newData, {
        langType: selectedLang,
        tz: tzArea < 0 ? Math.abs(tzArea) : -tzArea,
        ts: getTS(),
      });

      if (Object.keys(params || {}).length > 0) {
        // post接口也可以接受query参数
        const newParams = {};
        // 如果params里有depCode, currDepCode, currDevCode的话 用params里的depCode, currDepCode, currDevCode
        Object.assign(newParams, { depCode }, params);
        Object.assign(newParams, { dep_code }, params);
        Object.assign(newParams, { currDepCode }, params);
        Object.assign(newData, { wbsCode: depCode }, data);
        Object.assign(newData, { wbs_code: depCode }, data);
        Object.assign(newData, { currWbsCode: currDepCode }, data);
        Object.assign(newParams, { devCode }, params);
        Object.assign(newParams, { dev_code }, params);
        Object.assign(newParams, { currDevCode }, params);
        Object.assign(params as object, newParams, {
          random: currDate.getTime(),
          langType: selectedLang,
          tz: tzArea < 0 ? Math.abs(tzArea) : -tzArea,
          ts: getTS(),
        });
      }
    }
  }
  const newOptions = { ...options };
  // 处理文件上传 查看的URL配置， 因为云存储 不走微服务
  if (cToken && url.indexOf('/file/aut') > -1) {
    newOptions.headers = {
      ctoken: cToken || '',
    };
    return {
      url,
      options: newOptions,
    };
  }
  if (cToken && url.indexOf('/PDFServer') > -1) {
    newOptions.headers = {
      ctoken: cToken || '',
    };
    return {
      url,
      options: newOptions,
    };
  }



  // 为了适配 后台的微服务架构 需要把 微服务名称：SrvName 和 URLPart放到header请求里
  newOptions.headers = {
    ctoken: cToken || '',
    SrvName: encrypt(SrvName[getSrvName(url)], TOKENCRYPTOJSKEY),
    URLPart: encrypt(url.replace('/api', ''), TOKENCRYPTOJSKEY),
  };
  if (process.env.NODE_ENV === 'development') {
    Object.assign(newOptions.headers, {
      url: `${SrvName[getSrvName(url)]}${url}`,
      srName: SrvName[getSrvName(url)],
    });
  }
  // if(options.method?.toLocaleLowerCase() === 'post'){
  //   postRequestList.push(newOptions.headers.URLPart)
  //   newOptions.signal = signal;
  // }

  if (url.indexOf('hws') > -1) {
    return {
      url: url.replace('/hws', ''),
      options: newOptions,
    };
  }
  // 新 统一上传文件方式，包括：OBS/OSS/本地上传
  if (url.indexOf('allUpload') > -1) {
    return {
      url: url.replace('/allUpload', ''),
      options: newOptions,
    };
  }

  if (process.env.NODE_ENV === 'development') {
    Object.assign(newOptions.headers, {
      url: `${SrvName[getSrvName(url)]}${url}`,
    });
  }

    //  测试环境
  if (process.env.NODE_ENV === 'development' && cToken && (url.indexOf('/ZyyjIms') > -1 || url.indexOf('/flow') > -1)) {
    newOptions.headers = {
      url: `${SrvName[getSrvName(url)]}${url}`,
      srName: SrvName[getSrvName(url)],
      ctoken: cToken || '',
      token: jwtToken
    };
    return {
      url,
      options: newOptions,
    };
  }

  return {
    url: cToken ? '/api/apiGateway/aut/microService' : '/api/apiGateway/naut/microService',
    options: newOptions,
  };
});

/**
 * response拦截器, 处理response
 */
// @ts-ignore
request.interceptors.response.use(async (response) => {
  if (response.status === 204 && response.url.includes('cloud')) {
    return {
      errCode:0
    };
  }
  const data = await response.clone().json();
  if (data.errCode && data.errCode !== ErrorCode.ErrOk && data.errInfo) {
    // 错误码， 也有错误信息
    Modal.error({
      width: 600,
      title: 'Error',
      content: (
        <div>
          {data.errInfo.split('<br/>').map((item: any, index: number) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      ),
    });
    return {
      errCode: data.errCode,
      errInfo: data.errInfo,
      result: [],
      rows: [],
      total: 0,
      ...data,
    };
  }
  if (data.errCode === ErrorCode.ErrOk && data.errInfo) {
    //  返回正确码，也有提示信息： 警告处理
    Modal.warning({
      width: 500,
      title: 'warning',
      content: (
        <div>
          {data.errInfo.split('<br/>').map((item: any, index: number) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      ),
    });
    return {
      errCode: data.errCode,
      errInfo: data.errInfo,
      result: [],
      rows: [],
      total: 0,
      ...data,
    };
  }
  // 用户登陆成功后 存储token
  if (data.func && data.token && data.errCode === ErrorCode.ErrOk) {
    localStorage.setItem('x-auth-token', data.token);
    // 用户登陆成功后，存储用户所属的公司/分公司账号的最高级别 depCode, currDepCode
    if (data.userInfo) {
      localStorage.setItem('auth-default-userCode', data.userInfo.user_code);
      localStorage.setItem('auth-default-userName', data.userInfo.user_name);
      localStorage.setItem('auth-default-wbsCode', data.userInfo.default_wbs_code);
      localStorage.setItem('auth-default-wbsName', data.userInfo.default_wbs_name);
      localStorage.setItem('auth-default-currWbsCode', data.userInfo.curr_wbs_code);
      localStorage.setItem('auth-default-level', data.userInfo.level);
      localStorage.setItem('auth-default-wbs-prop-key', data.userInfo.default_prop_key);

      // 为了兼容现有老系统多存的两个参数
      localStorage.setItem('sinopec-current-dep-short-code', data.userInfo.curr_wbs_code);
      localStorage.setItem('sinopec-current-dep-full-code', data.userInfo.default_wbs_code);

      localStorage.setItem('auth-current-wbs-full-code', data.userInfo.default_wbs_code);
      localStorage.setItem('auth-current-wbs-short-code', data.userInfo.curr_wbs_code);

      // 为了兼容管道系统多存的参数
      localStorage.setItem('auth-default-cpecc-branchCompCode', data.userInfo.default_wbs_code);
      localStorage.setItem('auth-default-cpecc-depCode', data.userInfo.default_wbs_code);
      localStorage.setItem('auth-default-cpecc-currDepCode', data.userInfo.curr_wbs_code);
    }
  }
  return response;
});

// const newRequest = (url: any, options?: any) => {
//   const method = options && options.method ? options.method : '';
//   if (method.toLocaleUpperCase() === 'POST') {
//     // post请求
//     // return throttle(request, 500)(url, options);
//     return request(url, options)
//   }
//   // get请求
//   return request(url, options)
//
// }

export default request;
