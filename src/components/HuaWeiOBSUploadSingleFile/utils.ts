import moment from "moment";

const processCommonEnv = {
  A_KEY: '59,61,59,61,6e,67,57,65,62,',
  B_KEY: '50,61,72,61,6d,37,37',
  pKey: '59,61,59,61,6e,67,43,50,',
  bKey: '45,43,43,57,4d,37,37,37',
  T_s: '33,34,65,38,',
  T_c: '62,63,64,38,31,37,',
  T_e: '64,65,62,32,35,62',
  a_k: '59,61,59,61,6e,',
  b_k: '67,43,50,45,43,',
  c_k: '43,46,53,37,37,37',
}

/**
 * 通过解析请求路径 获取微服务名称
 * @param apiUrl
 */
const getSrvName = (apiUrl: string) => {
  let key = 'basic';
  if (apiUrl) {
    const keys = apiUrl.split('/');
    key = keys[2] || 'basic';
  }
  return key;
}

const hexToString = (str: string) => {
  let val = '';
  const arr = str.split(',');
  for (let i = 0; i < arr.length; i += 1) {
    val += String.fromCharCode(parseInt(arr[i], 16))
  }
  return val;
}

/**
 * 获取密钥
 * @returns 
 */
const getTTTKey = () => {
  return hexToString(`${processCommonEnv.T_s}${processCommonEnv.T_c}${processCommonEnv.T_e}`);
};


export const getPPPKey = () => {
  return hexToString(`${processCommonEnv.A_KEY}${processCommonEnv.B_KEY}`);
}

export const getCCCKey = () => {
  return hexToString(`${processCommonEnv.a_k}${processCommonEnv.b_k}${processCommonEnv.c_k}`);
}

/**
 * 获取随机密钥 URL用
 * @returns 
 */
const getYYYKey = () => {
  return hexToString(`${processCommonEnv.pKey}${processCommonEnv.bKey}`);
}


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

export {
  getSrvName,
  getTTTKey,
  getYYYKey
}


/**
 * 对传入的图片 URL 中的特定字符进行编码
 * @param url - 待编码的图片 URL
 * @returns 编码后的图片 URL
 */
export function encodeImageUrl(url: string): string {
  const specialChars: string[] = ['@', '#', '$', '?'];
  const parts: string[] = url.split('');
  const encodedParts: string[] = parts.map((char: string) => {
    if (specialChars.includes(char)) {
      return encodeURIComponent(char);
    }
    return char;
  });
  return encodedParts.join('');
}

  /**
   * 非0时区 定义一个函数，根据传入的 format 格式化时间
   * @param format 
   * @returns 
   */
  export function getCurrTime(format?: string) {
    // 如果没有传入 format，则使用默认格式 'YYYY-MM-DD HH:mm:ss'
    const formattedTime = moment().format(format || 'YYYY-MM-DD HH:mm:ss');
    return formattedTime;
  }