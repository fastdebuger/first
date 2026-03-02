import { parse } from 'querystring';
import CryptoJS from 'crypto-js';
import { CONST, GET_REBUILD_OBS_CODE, HUA_WEI_OBS_CONFIG } from '@/common/const';
import moment from 'moment';
import { PROP_KEY } from "@/common/const"
import { decrypt } from './request';
import { deepArr } from './utils-array';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { WBS_CODE } from '@/common/const';
import { getTS,getTimeZoneParam } from './utils-date';

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  return window.location.hostname === 'preview.pro.ant.design';
};

// For the official demo site, it is used to turn off features that are not needed in the real development environment
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 通过解析请求路径 获取微服务名称
 * @param apiUrl
 */
export function getSrvName(apiUrl: string) {
  let key = 'basic';
  if (apiUrl) {
    const keys = apiUrl.split('/');
    key = keys[2] || 'basic';
  }
  return key;
}

export const showImgUrl = (url: string) => {
  if (!url) {
    return '';
  }
  if (url.indexOf('http://') > -1) {
    return url;
  }
  if (url.indexOf('https://') > -1) {
    return url;
  }
  return HUA_WEI_OBS_CONFIG.HOST_URL + url;
};

/**
 * 拆分 WBS信息 拆分成 树状结构的形式
 * @param rows
 * @param nodeKey
 * @param parentNodeKey
 */
export function genTreeData(rows: any, nodeKey: any, parentNodeKey: any) {
  const rootNode = rows.filter((item: any) => item[parentNodeKey] === '')[0]; // 根结点
  const rootNodeCode = rootNode ? rootNode[nodeKey] : '';
  const treeData: any[] = [];
  rows
    .filter((item: any) => {
      return item[nodeKey] === rootNodeCode;
    })
    .forEach((item: any) => {
      pushTreeNode(rows, item, nodeKey, parentNodeKey);
      treeData.push(item);
    });
  return treeData;
}

/**
 * 构建WBS树状的节点的 children
 * @param rows
 * @param parent
 * @param nodeKey
 * @param parentNodeKey
 */
export function pushTreeNode(rows: any, parent: any, nodeKey: any, parentNodeKey: any) {
  const children = rows.filter((item: any) => {
    return item[parentNodeKey] === parent[nodeKey];
  });

  if (children && children.length > 0) {
    Object.assign(parent, { children });
    children.forEach((item: any) => {
      pushTreeNode(rows, item, nodeKey, parentNodeKey);
    });
  }
}

export const hexToRgba = (hex: string, opacity: string) => {
  if (!hex) hex = '0x000000';
  const hexStr = hex.replace('0x', '#');
  const r = parseInt(hexStr.slice(1, 3), 16);
  const g = parseInt(hexStr.slice(3, 5), 16);
  const b = parseInt(hexStr.slice(5, 7), 16);
  const rgba = `rgba(${r}, ${g}, ${b}, ${opacity || '1'})`;
  console.log('--hexToRgba------rgba', rgba);
  return rgba;
};
/**
 * 获取指定时间的0时区的时间戳
 * 用于业务操作过程中，比如选择一个日期给到后台的话，用这个方法
 * @param timestamp
 */
export const getDateTS = (timestamp: number) => {
  const currD = new Date();
  const az = currD.getTimezoneOffset() / 60;
  const faz = az < 0 ? Math.abs(az) : -az;
  return Number(timestamp - faz * 3600);
};

/**
 * 根据获取的0时区 时间戳
 * 显示当前时区对应的时间 用于组件
 * 用于业务显示中，后台返回的时间戳，处理成用户所在的时区的时间
 * @param timestamp
 */
export const showMomentTS = (timestamp: number) => {
  const currD = new Date();
  const az = currD.getTimezoneOffset() / 60;
  const faz = az < 0 ? Math.abs(az) : -az;
  const currQu = Number(timestamp + faz * 3600);
  return moment.unix(currQu);
};

/**
 * 将0时区的时间 转换成用户所在时区的时间
 * @param timestamp
 */
export const getCurrTimeZoneDateTS = (timestamp: number) => {
  const currD = new Date();
  const az = currD.getTimezoneOffset() / 60;
  const faz = az < 0 ? Math.abs(az) : -az;
  return Number(timestamp + faz * 3600);
};

const cEnc = CryptoJS.enc;
const cA = CryptoJS.AES;
const cmc = CryptoJS.mode.CBC;
const cpp = CryptoJS.pad.Pkcs7;

const hexToString = (str: string) => {
  let val = '';
  const arr = str.split(',');
  for (let i = 0; i < arr.length; i += 1) {
    val += String.fromCharCode(parseInt(arr[i], 16));
  }
  return val;
};

export const getPPPKey = () => {
  return hexToString(`${process.env.A_KEY}${process.env.B_KEY}`);
};

/**
 * 解密
 * @param encryptedBase64Str
 * @param secretKey 密钥
 */
export function decryptA(encryptedBase64Str: any) {
  const secretKey = getPPPKey();
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
 * 获取华为云 报表等 相关配置
 */
export function getWebParam() {
  const webParam = localStorage.getItem('hw-fire-web-param');
  try {
    const dWebParam = decryptA(webParam);
    return JSON.parse(dWebParam);
  } catch (e) {
    console.error('utils getWebParam/decrypt error');
    return {
      ACCESS_KEY_ID: '',
      BUCKET: '',
      HOST_RPT: '',
      HOST_URL: '',
      SECRET_ACCESS_KEY: '',
      SERVER: '',
    };
  }
}

export const getYYYKey = () => {
  return hexToString(`${process.env.pKey}${process.env.bKey}`);
};

/**
 * 获取密钥
 * @returns
 */
export const getTTTKey = () => {
  return hexToString(`${process.env.T_s}${process.env.T_c}${process.env.T_e}`);
};

/**
 * office在线预览文件
 * @param url
 */
export function previewOfficeOnline(url: string) {
  window.open(`https://view.officeapps.live.com/op/view.aspx?src=${url}`);
}


// export const getTTTKey = () => {
//   return hexToString(`${process.env.T_a}${process.env.T_b}`);
// }

export function isImage(fileName: string) {
  const regex = /\.(jpe?g|png|gif|bmp|tiff?|svg|webp)$/i;
  return regex.test(fileName);
}

export function isOfficeFile(fileName: string) {
  const officeRegex = /\.(doc|docx|dot|dotx|docm|dotm|xls|xlsx|xlsm|xlsb|xlt|xltx|xltm|csv|ppt|pptx|pot|potx|ppsx|pptm|potm|ppsm)$/i;
  return officeRegex.test(fileName);
}



/**
* 处理不同的层级所展示的公司层级不一样
*/
export const getDepTitle = () => {
  switch (PROP_KEY) {
    case "branchComp":
      return [
        'branch_comp_name',
        'dep_name',
      ]
    case "subComp":
      return [
        'dep_name',
      ]
    case "dep":
      return []
    default:
      return []
  }
}

/**
   * 获取默认的过滤条件配置
   * 根据全局常量 PROP_KEY 的不同值，返回相应的默认过滤器数组。
   * 每个过滤器对象包含 Key（字段名）、Val（字段值）、Operator（操作符）三个属性。
   *
   * @returns 过滤器配置数组，数组中的每个元素都是一个包含 Key、Val、Operator 属性的对象
   */
export const getDefaultFilters = () => {
  // PROP_KEY 取得 auth-default-wbs-prop-key的值判断当前层级
  switch (PROP_KEY) {
    // 公司级
    case 'branchComp':
      return [
        { Key: 'is_submit', Val: '1', Operator: '=' },
      ];
    // 分公司
    case 'subComp':
      return [
        { Key: 'is_submit', Val: '1', Operator: '=' }, // 是否发起审批
        { Key: 'branch_comp_code', Val: getCurDepFullCode(), Operator: '=' }

      ];
      // 项目部
    case 'dep':
      return [
        { Key: 'dep_code', Val: localStorage.getItem('auth-default-cpecc-depCode'), Operator: '=' }

      ];
    default:
      return [];
  }
};

/**
 * 根据不同得层级获取不同得层级接口
 */
export const getDifferentInterface: any = () => {
  // PROP_KEY 取得 auth-default-wbs-prop-key的值判断当前层级,来获取不同接口
  switch (PROP_KEY) {
    // 公司级
    case 'branchComp':
      return {
        type :'appraiseInfo/getCompYearInfoList',
        payload: { sort: 'id', order: 'asc' },
      }
    // 分公司
    case 'subComp':
      return {
        type :'appraiseInfo/getBranchCompYearInfoList',
        payload: { sort: 'id', order: 'asc' }
      }
      // 项目部
    case 'dep':
      return {
        type :'appraiseInfo/getDepYearInfoList',
        payload: { sort: 'head_id', order: 'asc' }
      }
    default:
      return {};
  }
};

/**
 * 项目数据接口
 */
interface ProjectData {
  owner_group: string | number;
  contract_mode: string | number;
  contract_say_price: number;
  [key: string]: any;
}

/**
 * 价格级别配置项接口
 */
interface PriceLevelItem {
  owner_group: string | number;
  contract_mode: string | number;
  max_price?: number | string | null;
  min_price: number;
  project_level_str: string;
  [key: string]: any;
}

/**
 * 获取项目级别
 * @param from 包含项目属性的对象
 * @param priceLevelConfig 项目级别配置列表
 * @returns 项目级别字符串，默认为 "C级"
 */
export const getProjectLevel = (
  from: ProjectData,
  priceLevelConfig: PriceLevelItem[] = []
): string => {
  const {
    owner_group,
    contract_mode,
    contract_say_price,
  } = from;

  // 统一将 ID 转换为字符串，以便与配置项进行安全比较
  const ownerGroupStr = String(owner_group);
  const contractModeStr = String(contract_mode);

  // 1. 过滤出匹配 owner_group 和 contract_mode 的配置项
  const arr = priceLevelConfig
    .filter((item) => {
      return String(item.owner_group) === ownerGroupStr && String(item.contract_mode) === contractModeStr;
    });

  // 2. 遍历匹配项，检查 contract_say_price 是否在价格范围内
  if (arr.length > 0) {
    for (let index = 0; index < arr.length; index++) {
      const item = arr[index];

      // ****** 修复0和""导致的bug ******
      let max_price: number;
      const raw_max_price = item.max_price;

      // 如果 max_price 是 null, undefined 或空字符串 ""，则视为最大值
      if (raw_max_price === null || raw_max_price === undefined || raw_max_price === "") {
        max_price = Number.MAX_VALUE;
      } else {
        // 否则，转换为数字。0 和有效数字会被正确保留。
        max_price = Number(raw_max_price);

        // 增加对 NaN 的简单处理，如果转换后是非数字，也视为最大值
        if (isNaN(max_price)) {
          max_price = Number.MAX_VALUE;
        }
      }

      const min_price = item.min_price;
      if (contract_say_price <= max_price && contract_say_price >= min_price) {
        return item.project_level_str
      }
    }
  }

  return "C级";
};

/**
 * 将阿拉伯数字转换为中文数字表示（整数）
 * 例如：1 -> "一"，10 -> "十"，12 -> "十二"，20 -> "二十"，101 -> "一百零一"
 * 最大支持到兆（10^12），更大数值会按字符串处理但不建议超出该范围
 * @param input 需要转换的数字或数字字符串
 */
export function numberToChinese(input: number | string): string {
  if (input === null || input === undefined || input === ('' as any)) {
    return '';
  }

  // 统一为字符串并去除空白
  const raw = String(input).trim();

  // 处理负数
  const isNegative = raw.startsWith('-');
  const normalized = isNegative ? raw.slice(1) : raw;

  // 仅保留整数部分
  const integerPart = normalized.split('.')[0].replace(/^0+(?!$)/, '');

  // 特殊处理 0
  if (integerPart === '' || /^0+$/.test(integerPart)) {
    return '零';
  }

  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unitsSmall = ['', '十', '百', '千'];
  const unitsBig = ['', '万', '亿', '兆']; // 10^0, 10^4, 10^8, 10^12

  // 将数字每四位分组，从低位到高位
  const groups: string[] = [];
  let rest = integerPart;
  while (rest.length > 0) {
    const end = rest.length;
    const start = Math.max(0, end - 4);
    groups.push(rest.slice(start, end));
    rest = rest.slice(0, start);
  }

  // 转换单个四位组
  const convertGroup = (groupStr: string): string => {
    const len = groupStr.length;
    let result = '';
    for (let i = 0; i < len; i += 1) {
      const num = Number(groupStr[i]);
      const unitIdx = len - i - 1; // 千百十个
      if (num === 0) {
        // 仅在后续还有非零并且当前结果末尾不是零时添加"零"
        if (result[result.length - 1] !== '零') {
          result += '零';
        }
      } else {
        result += digits[num] + unitsSmall[unitIdx];
      }
    }
    // 去除结尾的"零"
    result = result.replace(/零+$/g, '');
    // 合并连续"零"
    result = result.replace(/零{2,}/g, '零');
    // 十到十九前面的"一"省略：例如"一十二" -> "十二"
    result = result.replace(/^一十(.*)/, '十$1');
    return result;
  };

  let chinese = '';
  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i]; // 低位组优先
    const part = convertGroup(group);
    if (part) {
      chinese = part + unitsBig[i] + chinese;
    } else {
      // 组内全为0，若当前已有内容且不以零开头，则在高位与已有内容之间填充一个零
      if (chinese && !chinese.startsWith('零')) {
        chinese = '零' + chinese;
      }
    }
  }

  // 去除可能的多余零
  chinese = chinese.replace(/零+/g, '零').replace(/^零|零$/g, '');

  return isNegative ? `负${chinese}` : chinese;
}


/**
 * 解密权限通用方法
 */
export const getIsHasUserGroupRight = (str: any) => {
  if (!str) {
    return false;
  }
  let userCode;
  try {
    const userInfo = JSON.parse(localStorage.getItem('login-user-information') as string);
    userCode = userInfo.user_code;
  } catch (e) {
    userCode = '';
  }

  try {
    const res = JSON.parse(decrypt(str, getTTTKey()));
    if (!res) {
      return false;
    }
    if (!res.userCode) {
      return false;
    }
    if (res.userCode !== userCode) {
      return false;
    }
    if (!res.right) {
      return false;
    }
    return res.right;
  } catch (e) {
    return false;
  }
  return false;
};



/**
 * 对象数组分组
 * @param arr
 */
export const groupObjArr = (arr: any[]) => {
  if (arr.length < 1) {
    return [];
  }
  return arr.reduce((prevValue, currentValue) => {
    let index = -1;
    prevValue.some((item: any, i: any) => {
      if (item.func_code === currentValue.func_code) {
        index = i;
        return true;
      }
      return false;
    });
    if (index > -1) {
      prevValue[index].ability_code.push({
        key: currentValue.ability_code,
        template_code: currentValue.template_code,
      });
    } else {
      prevValue.push({
        func_code: currentValue.func_code,
        ability_code: [{
          key: currentValue.ability_code,
          template_code: currentValue.template_code,
        }],
      });
    }
    return prevValue;
  }, []);
};

/**
 * 退出登录
 */
export const loginOut = () => {
  const { redirect } = getPageQuery();
  // 退出登陆时，清空缓存中的所有数据(除了版本)
  for (const itemKey in localStorage) {
    if (
      itemKey &&
      itemKey !== 'system-current-version-time' &&
      itemKey !== 'system-current-version' &&
      itemKey !== 'module-collect'
    ) {
      localStorage.removeItem(itemKey);
    }
  }
  if (window.location.pathname !== '/user/login' && !redirect) {
    window.location.replace(window.location.origin + '/user/login');
  }
}


/**
 * 获取最终的columns 这里会根据最小模块配置 加载到单元 管线 管道图号 还是 管段号
 * @param tableColumns
 */
export const getFinalTableColumns = (tableColumns: any[]) => {
  const minLevelStr = localStorage.getItem('system-min-level-module-config');
  let parseMinLevelArr = ['pipe_code', 'pipe_image_no', 'pipe_section_code'];
  if (minLevelStr === 'unit_code') {
    parseMinLevelArr = ['pipe_code', 'pipe_image_no', 'pipe_section_code'];
  } else if (minLevelStr === 'pipe_code') {
    parseMinLevelArr = ['pipe_image_no', 'pipe_section_code'];
  } else if (minLevelStr === 'pipe_image_no') {
    parseMinLevelArr = ['pipe_section_code'];
  } else if (minLevelStr === 'pipe_section_code') {
    parseMinLevelArr = [];
  } else {
    parseMinLevelArr = ['pipe_code', 'pipe_image_no', 'pipe_section_code'];
  }
  if (tableColumns && tableColumns.length > 0) {
    return tableColumns.filter((col: any) => !parseMinLevelArr.includes(col.dataIndex));
  }
  return [];
};


/**
 * 系统是否需要审批
 * @param tableColumns
 */
export const getApprovalTableColumns = (tableColumns: any[]) => {
  const deep = deepArr(tableColumns);
  const url = window.location.pathname
  console.log(url)
  let isOpenApproval = localStorage.getItem('system-is-open-approval');
  if (url.includes('JiaBorrowLost')) {
    isOpenApproval = localStorage.getItem('system-is_open_borrow_approval');
  }
  if (url.includes('JiaPreOutStorage')) {
    return deep;
  }
  if (isOpenApproval && Number(isOpenApproval) > 0) {
    return deep;
  }
  // if (deep && deep.length > 0) {
  //   const result = deep.filter(
  //     (col: any) => col.subTitle !== '审批状态' && col.dataIndex !== 'apprv_complete_ts',
  //   );
  //   return result;
  // }
  return deep;
};

/**
 * 获取当前项目部编码
 */
export function getCurDepFullCode() {
  return localStorage.getItem('auth-default-wbsCode');
}


/**
 * 物资打印
 * @param forNo 单据号
 * @param module 报表模块
 */
export function materialFlowReportQR(forNo: any, module: any) {
  const currDepCode = localStorage.getItem('auth-default-currWbsCode');
  window.open(
    `${CONST.HOST_RPT
    }?currDepCode=${currDepCode}&depCode=${getCurDepFullCode()}&reportlet=Materials2.0/${module}&op=write&filter=${forNo}`,
  );
}


/**
 * 获取不同的分类编码下的 允许超的比例数
 * @param arr
 * @param item
 * @param key
 */
export const getAllowMoreNum = (arr: any[], item: any, key: string) => {
  if (!arr) {
    return 0;
  }
  if (arr.length < 1) {
    return 0;
  }
  if (!item) {
    return 0;
  }
  if (!item.cls_code) {
    return 0;
  }
  const filterArr = arr.filter((a: any) => a.cls_code === item.cls_code);
  if (filterArr.length < 1) {
    return 0;
  }
  if (!filterArr[0][key]) {
    return 0;
  }
  if (isNaN(+filterArr[0][key])) {
    return 0;
  }
  return +filterArr[0][key];
};

/**
 * 物资打印
 * @param forNo 单据号
 * @param dev_code 装置号
 * @param module 报表模块
 */
export function materialAllFlowReport(forNo: any, dev_code: any, module: any) {
  const currDepCode = localStorage.getItem('auth-default-currWbsCode');
  window.open(
    `${CONST.HOST_RPT
    }?currDepCode=${currDepCode}&depCode=${getCurDepFullCode()}&dev_code=${dev_code}&form_no=${forNo}&reportlet=Materials2.0/${module}`,
  );
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

export function getCode(prop_key: string | undefined) {
  switch (prop_key) {
    case 'branchComp':
      return 'B51'
    case 'subComp':
      return 'S51'
    default:
      return 'D51'
  }
}



export const changeWbs = (selectedData: any) => {
  // 重新存取逻辑
  localStorage.setItem('auth-default-wbsCode', selectedData.wbs_code);
  localStorage.setItem('auth-default-wbsCode', selectedData.wbs_code);
  localStorage.setItem('auth-default-wbsName', selectedData.wbs_name);
  localStorage.setItem('auth-default-currWbsCode', selectedData.curr_wbs_code);
  localStorage.setItem('auth-default-wbs-prop-key', selectedData.prop_key);
  // 为了兼容现有老系统多存的两个参数
  localStorage.setItem('sinopec-current-dep-short-code', selectedData.curr_wbs_code);
  localStorage.setItem('sinopec-current-dep-full-code', selectedData.wbs_code);
  localStorage.setItem('auth-default-cpecc-depCode', selectedData.wbs_code);
  localStorage.setItem('auth-default-cpecc-currDepCode', selectedData.curr_wbs_code);
  localStorage.setItem('auth-current-wbs-full-code', selectedData.wbs_code);
  localStorage.setItem('auth-current-wbs-short-code', selectedData.curr_wbs_code);
  // 为了兼容管道系统多存的参数
  localStorage.setItem('auth-default-cpecc-branchCompCode', selectedData.wbs_code);
  localStorage.removeItem('auth-cpecc-selected-unitProjectCode');
  localStorage.removeItem('auth-cpecc-selected-unitProjectName');
  localStorage.removeItem('auth-cpecc-selected-unitCode');
  localStorage.removeItem('auth-cpecc-selected-unitName');
}

export const initDev = (res: any) => {
  if (res?.result?.length > 0) {
    //  初始化一个默认装置
    const initDev = res.result[0];
    localStorage.setItem('auth-cpecc-selected-devCode', initDev.dev_code);
    localStorage.setItem('auth-cpecc-selected-devName', initDev.dev_name);
    localStorage.setItem('auth-cpecc-selected-currDevCode', initDev.curr_dev_code);
    localStorage.setItem('auth-cpecc-selected-wbscode', initDev.dev_code);
  } else {
    localStorage.setItem('auth-cpecc-selected-devCode', '');
    localStorage.setItem('auth-cpecc-selected-devName', '');
    localStorage.setItem('auth-cpecc-selected-currDevCode', '');
    localStorage.setItem('auth-cpecc-selected-wbscode', '');
  }
}



// 1. 定义树形节点的接口
export interface WbsNode {
  wbs_code: string;
  wbs_name: string;
  is_can_switch: number;
  children?: WbsNode[];
  [key: string]: any;
}

/**
 * 深度搜索树形数据，返回匹配节点及其所有匹配父节点的树结构。
 * @param tree 原始的树形数据数组。
 * @param searchValue 搜索关键词。
 * @returns 过滤后的树形数据数组。
 */
export const filterTreeData = (tree: WbsNode[], searchValue: string): WbsNode[] => {
  // 如果搜索关键词为空，直接返回原始树
  if (!searchValue) return tree;
  const lowerCaseSearchValue = searchValue.toLowerCase();

  // 递归遍历函数
  const traverse = (nodes: WbsNode[]): WbsNode[] => {
    const matchedNodes: WbsNode[] = [];

    for (const node of nodes) {
      const matches = node.wbs_name.toLowerCase().includes(lowerCaseSearchValue);
      let matchedChildren: WbsNode[] = [];
      if (node.children) {
        matchedChildren = traverse(node.children);
      }
      if (matches || matchedChildren.length > 0) {
        matchedNodes.push({
          ...node,
          children: matchedChildren.length > 0 ? matchedChildren : node.children,
        });
      }
    }
    return matchedNodes;
  };

  return traverse(tree);
};


/**
 * 原始配置列的操作符类型
 */
interface ColumnOperator {
  key: string;
  title: string;
  defaultVal: string;
}

/**
 * 原始配置列类型（支持递归嵌套 children）
 */
interface OriginalColumn {
  title: string;
  subTitle?: string;
  dataIndex: string;
  key: string;
  width?: number;
  align?: string;
  ellipsis?: boolean;
  sorter?: boolean;
  header?: boolean;
  fixed?: boolean;
  isChecked?: boolean;
  groupOrder?: number;
  groupName?: string;
  upDataIndex?: string;
  serial_no?: number;
  operatorList?: ColumnOperator[];
  operatorDefaultValue?: string;
  export?: boolean;
  // 递归嵌套的子列
  children?: OriginalColumn[];
}

/**
 * 格式化后的多级表头数据类型（后台所需格式）
 */
export interface FormattedColumn {
  cls_key: string;
  cls_name: string;
  cls_up_name: string;
}

/**
 * 处理配置列生成多级表头格式数据（TypeScript 严格类型版）
 * @param columns - 原始配置列数组（严格类型约束）
 * @returns 格式化后的多级表头数据
 */
export function formatMultiLevelColumns(columns: object[]): FormattedColumn[] {
  const result: FormattedColumn[] = [];

  /**
   * 递归处理单个列（支持嵌套 children）
   * @param column - 当前处理的列
   * @param parentName - 父级列名称（用于设置 cls_up_name）
   */
  const handleColumn = (column: any, parentName: string = ''): void => {
    // 有子列：递归处理子列，当前列的 title 作为父级名称
    if (column.children && column.children.length > 0) {
      const currentParentName = column.title.trim() || '';
      column.children.forEach((child: OriginalColumn) => handleColumn(child, currentParentName));
    } else {
      // 无子列：生成目标格式数据
      const clsKey = column.dataIndex.trim() || column.key.trim();
      const clsName = column.subTitle?.trim() || column.title.trim() || '';

      // 校验核心字段（避免空值）
      if (!clsKey || !clsName) return;

      // 父级名称优先级：父列 title > 自身名称
      const clsUpName = parentName || clsName;

      result.push({
        cls_key: clsKey,
        cls_name: clsName,
        cls_up_name: clsUpName
      });
    }
  };

  // 遍历所有原始列，开始递归处理
  columns.forEach(column => handleColumn(column));
  return result;
}

/**
 * 根据文件链接的后缀名进行分类。
 * * @param {string} fileUrl - 文件链接字符串。
 * @returns {string} - 返回 'pdf', 'office', 'img', 'video' 或 'other'。
 */
export function getFileTypeCategory(fileUrl: string | undefined | null) {

  if (fileUrl === undefined || fileUrl === null || fileUrl === '') {
    return 'unknow';
  }

  // 1. 获取文件扩展名 (通过URL的最后部分，并转换为小写)
  // 示例: "http://example.com/file.DOCX?token=123" -> "docx"
  const extensionMatch = fileUrl.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);

  if (!extensionMatch) {
    return 'other'; // 没有找到扩展名
  }

  // 提取并转换为小写
  const ext = extensionMatch[1].toLowerCase();

  // 2. 定义分类规则

  // 图片 (Image) 类型
  const imgExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico', 'tiff', 'svg'];

  // PDF 类型
  const pdfExts = ['pdf'];

  // Office 类型 (常见的 Word, Excel, PowerPoint, Text)
  const officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt'];

  // Video 类型 (常见的视频格式)
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', '3gp'];

  // 3. 进行分类判断

  if (imgExts.includes(ext)) {
    return 'img';
  }

  if (pdfExts.includes(ext)) {
    return 'pdf';
  }

  if (officeExts.includes(ext)) {
    return 'office';
  }

  if (videoExts.includes(ext)) {
    return 'video';
  }

  // 4. 默认返回
  return 'other';
}

// 用于触发文件下载
export const handleDownload = (fileUrl: string) => {
  // console.log('fileUrl :>> ', fileUrl);
  // 可以在此处添加下载前的验证逻辑
  const originUrl = fileUrl?.split("?")
  const url = getUrlCrypto(originUrl[0])
  window.open(url, '_blank');
};


/**
 * 合同接口统一调用方法
 * @param type 合同类型：'income' | 'expenditure'
 * @param params 查询参数
 * @param dispatch dispatch 函数
 * @param callback 回调函数
 */
export const fetchContractData = (
  type: 'income' | 'expenditure',
  params: any,
  dispatch: any,
  callback?: (response: any) => void
) => {
  const actionType = type === 'income'
    ? 'income/getIncomeInfo'
    : 'expenditure/queryContract';

  return dispatch({
    type: actionType,
    payload: params,
    callback: (response: any) => {
      if (callback) {
        callback(response);
      }
    }
  });
}

/**
 * 解密
 * @param encryptedBase64Str
 * @param secretKey 密钥
 */
export function decryptConfig(encryptedBase64Str) {
  const secretKey = getPPPKey();
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
   * 将对象转换为查询字符串
   * @param params 参数对象
   * @returns 查询字符串（不包含开头的?）
   */
  const objectToQueryString = (params: object): string => {
    if (!params || typeof params !== 'object') {
      return '';
    }

    const queryParams: string[] = [];
    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      // 过滤掉 null、undefined 和空字符串
      if (value !== null && value !== undefined && value !== '') {
        // 对键和值进行 URL 编码
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(String(value));
        queryParams.push(`${encodedKey}=${encodedValue}`);
      }
    });

    return queryParams.join('&');
  };

  /**
   * 获取打印报表URL
   * 根据环境（正式/测试）返回不同的报表地址
   * @param reportName 报表名称
   * @param reportPath 报表路径
   * @param params 报表参数
   */
  export const getPrintUrl = (reportPath: string, reportName: string, params?: object) => {
    const isProduction = process.env.BUILD_ENV === 'pro';
    let baseUrl = '';

    if (isProduction) {
      // 正式环境
      baseUrl = `http://123.6.232.59:8080/webroot/ReportServer?reportlet=WeldSys2.0/${reportPath}/${reportName}.cpt`;
    } else {
      // 测试/本地环境
      baseUrl = `http://49.4.11.48:8080/webroot/decision/view/report?viewlet=WeldSys2.0/${reportPath}/${reportName}.cpt`;
    }

    // 如果有参数，将参数拼接到 URL 后面
    if (params) {
      const queryString = objectToQueryString(params);
      if (queryString) {
        // URL 中已经有查询参数，使用 & 连接；否则使用 ?
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${queryString}`;
      }
    }

    return baseUrl;
  };

    // 如果是安全环保部 显示所有的
  export const IsTheMinistryOfSafetyProtection = () => {
    return GET_REBUILD_OBS_CODE === "C01.institutions.13"
  }

/**
 * 获取动态组织属性键
 * @description 根据层级返回对应的数据字段名。
 */
export const getOrgLevelFieldKey = (branchComp: any, subComp: any, dep: any) => {
  switch (PROP_KEY) {
    case "branchComp":
      return branchComp
    case "subComp":
      return subComp
    case "dep":
      return dep
    default:
      return undefined
  }
}

/**
 * 根据 level_code 字符串的前缀 (I, II, III, IV) 转换为对应的数字 (1, 2, 3, 4)。
 * @param levelCode 待处理的 level_code 字符串。
 * @returns 对应的数字 (1, 2, 3, 4)，如果前缀不匹配，则返回 null 或 undefined (可根据需求调整)。
 */
export function convertLevelCodeToNumber(levelCode: string): number | null {
  if (levelCode.startsWith("I级")) {
    return 1;
  }
  if (levelCode.startsWith("II级")) {
    return 2;
  }
  if (levelCode.startsWith("III级")) {
    return 3;
  }
  if (levelCode.startsWith("IV级")) {
    return 4;
  }

  // 如果没有匹配到任何已知级别，返回 null
  return null;
}


/**
 * 比值转百分比（保留 1 位小数）
 * @param {number} numerator - 分子
 * @param {number} denominator - 分母
 * @param {number} fixedNumber - 保留小数点后几位
 * @returns {string} 带百分号的百分比字符串（如 "33.3%"）
 */
export function toPercent(numerator, denominator, fixedNumber? = 1) {
  if (denominator === 0) return "0.0%"; // 避免除以 0
  const ratio = numerator / denominator;
  return `${(ratio * 100).toFixed(1)}%`;
}


/**
 * 比值转百分比数值（保留 1 位小数）
 * @param {number} numerator - 分子
 * @param {number} denominator - 分母
 * @param {number} fixedNumber - 保留小数点后几位
 * @returns {string} 带百分号的百分比字符串（如 "33.3%"）
 */
export function toPercentNum(numerator, denominator, fixedNumber? = 1) {
  if (denominator === 0) return 0; // 避免除以 0
  const ratio = numerator / denominator;
  return (ratio * 100).toFixed(fixedNumber);
}


/**
 * 处理表格数据分组
 * 用于处理表格分组的函数 - 将相同sortkey的数据分组,在月度施工计划中使用
 * @param data - 需要处理的原始数据
 * @returns 分组后的数据
 */
export const MonthlyPlanProcessData = (data: any) => {
  // 数据是空的话，直接返回空数组
  if (!data || !Array.isArray(data)) return [];

  // 分组后的数据
  const groups: any = {};
  // 函数整理好的返回数据
  const result: any = [];

  data.forEach(item => {
    const key = item.sortkey;
    // 后台返回的sortkey为空则不给加children
    if (!key) {
      result.push({
        ...item,
        key: `independent_${item.RowNumber}`, // 确保独立行也有唯一 key
        children: null
      });
      return;
    }
    // 如果后台返回有sortkey 并且没有在分组里面，则创建父行数据
    if (!groups[key]) {
      // 第一次遇到该 sortkey：创建父行
      groups[key] = {
        ...item,
        key: `parent_${key}`,
        children: []
      };
      result.push(groups[key]);
    } else {
      // 将后续相同的 sortkey项做为子行
      groups[key].children.push({
        ...item,
        key: `${key}_${item.RowNumber}`
      });
    }
  });

  return result;
};



/**
 * 质量检查员模块的通用方法，用来传递默认的过滤条件
 * 他们每个模块都有公司层级以及分公司层级和项目部层级
 * @returns 数组格式的过滤条件
 */
export const getDefaultFiltersInspector = () => {
  // PROP_KEY 取得 auth-default-wbs-prop-key的值判断当前层级
  switch (PROP_KEY) {
    // 公司级
    case 'branchComp':
      return [];
    // 分公司
    case 'subComp':
      return [
        { Key: 'sub_comp_code', Val: getCurDepFullCode(), Operator: '=' }
      ];
      // 项目部
    case 'dep':
      return [
        { Key: 'dep_code', Val: localStorage.getItem('auth-default-cpecc-depCode'), Operator: '=' }
      ];
    default:
      return [];
  }
};
/**
 * 质量管理得通用方法，用来更具层级来判断显示得字段
 */
export const getDisplayHierarchy = () => {
  switch (PROP_KEY) {
    case "branchComp":
      return ['sub_comp_name', 'dep_name']
    case "subComp":
      return ['sub_comp_name', 'dep_name']
    case "dep":
      return ['dep_name']
    default:
      return []
  }
}
/**
 * 获取用户信息和系统参数的统一函数
 * 如用户名称\ts\tz等
 * 需要在 技术质量审批模块统一使用，所以写了这个方法
 */
export const getUserInfoAndParams = () => {
  const userInfoStr = localStorage.getItem('login-user-information');
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
  let userInfo: any = null;
  userInfo = JSON.parse(userInfoStr);
  // 获取当前时间戳
  const ts = getTS();

  // 获取时区参数
  const tz = getTimeZoneParam();
  return {
    currUserCode: userInfo?.user_code || undefined,
    currUserName: userInfo?.user_name || undefined,
    ts: ts || undefined,
    tz: tz || undefined,
    depCode: depCode || undefined,
  };
}


/**
 * 判断字符串数组中的所有元素是否都相同
 * @param {string[]} arr - 要检查的字符串数组
 * @returns {boolean} - 所有元素相同返回true，否则返回false
 */
export function areAllElementsSame(arr) {
  // 处理边界情况：空数组或只有一个元素，默认判定为所有元素相同
  if (arr.length <= 1) {
    return true;
  }

  // 取第一个元素作为参照标准
  const firstElement = arr[0];

  // 遍历数组中从第二个开始的所有元素，逐一对比
  for (let i = 1; i < arr.length; i++) {
    // 如果有任意一个元素和第一个元素不相等，直接返回false
    if (arr[i] !== firstElement) {
      return false;
    }
  }

  // 所有元素都和第一个元素相等，返回true
  return true;
}



/**
 * 工程管理模块 承包商模块的通用方法，用来传递默认的过滤条件
 * 他们每个模块都有公司层级以及分公司层级和项目部层级
 * @returns 数组格式的过滤条件
 */
export const getDefaultFiltersEngine = () => {
  // PROP_KEY 取得 auth-default-wbs-prop-key的值判断当前层级
  switch (PROP_KEY) {
    // 公司级
    case 'branchComp':
      return [];
    // 分公司
    case 'subComp':
      return [
        { Key: 'branch_comp_code', Val: getCurDepFullCode(), Operator: '=' }
      ];
      // 项目部
    case 'dep':
      return [
        { Key: 'wbs_code', Val: localStorage.getItem('auth-default-cpecc-depCode'), Operator: '=' }
      ];
    default:
      return [];
  }
};


export function buildTree(data: any[]) {
  if (!data) {
    return [];
  }
  if (data.length === 0) {
    return [];
  }
  // 1. 创建一个映射表，用 id 快速查找节点
  const nodeMap: any = {};
  // 2. 初始化映射表
  data.forEach(node => {
    nodeMap[node.id] = {
      ...node, // 保留原有所有字段
      key: `${node.id}`, // key 映射为 id
      title: node.node_name, // title 映射为 node_name
      children: [] // 初始化子节点数组
    };
  });
  // 3. 收集根节点（pid = 0）
  const rootNodes: any[] = [];
  // 4. 遍历并构建树形结构
  data.forEach(node => {
    const currentNode = nodeMap[node.id];
    if (node.pid === 0) {
      // 如果是根节点，直接加入根节点列表
      rootNodes.push(currentNode);
    } else {
      // 如果不是根节点，挂载到父节点的 children 下
      const parentNode = nodeMap[node.pid];
      if (parentNode) {
        parentNode.children.push(currentNode);
      }
    }
  });
  return rootNodes;
}


export function buildTreeAndParent(data: any[]) {
  if (!data || data.length === 0) {
    return [];
  }

  // 1. 创建映射表，用 id 快速查找节点
  const nodeMap: any = {};

  // 2. 初始化映射表（新增 parentNode 字段存储直接父节点）
  data.forEach(node => {
    nodeMap[node.id] = {
      ...node, // 保留原有所有字段
      key: `${node.id}`, // key 映射为 id
      value: `${node.id}`, // key 映射为 id
      title: node.node_name, // title 映射为 node_name
      children: [], // 初始化子节点数组
      parentNode: null // 新增：仅存储直接父节点数据，默认null（根节点）
    };
  });

  // 3. 收集根节点（pid = 0）
  const rootNodes: any[] = [];

  // 4. 遍历构建树形结构，仅保存直接父节点数据
  data.forEach(node => {
    const currentNode = nodeMap[node.id];

    if (node.pid === 0) {
      // 根节点无父节点，直接加入根节点列表
      rootNodes.push(currentNode);
    } else {
      // 非根节点：挂载到父节点children，并保存直接父节点数据
      const parentNode = nodeMap[node.pid];
      if (parentNode) {
        // 先挂载子节点到父节点（这行先执行，避免解构冲突影响）
        parentNode.children.push(currentNode);

        // 修复：解构项改名，避免和目标对象 parentNode 冲突
        const { children, parentNode: pNode, ...parentBasicInfo } = parentNode;
        // 仅保存直接父节点的基础数据（排除循环引用字段）
        currentNode.parentNode = parentBasicInfo;
      }
    }
  });

  return rootNodes;
}

/**
 * 抽离：判断某个系统（module_code）是否已存在于目标数组中（单次判断）
 * @param {Array} targetList - 目标数组（如newPaperList）
 * @param {string} moduleCode - 模块编码
 * @returns {boolean} 是否存在
 */
export function isPaperExists(targetList: any[], moduleCode: string) {
  // 生成唯一标识（兼容null/undefined）
  const targetKey = `${moduleCode ?? ''}`;
  // 利用Set做高效查找（内部临时生成，适合单次/少量判断）
  const existingKeySet = new Set(
    targetList.map(item => `${item.module_code ?? ''}`)
  );
  return existingKeySet.has(targetKey);
}

/**
 * 优化：预生成Set的存在性判断（适合批量判断，避免重复生成Set，性能更优）
 * @param {Set} existingKeySet - 预生成的唯一标识集合
 * @param {string} moduleCode - 模块编码
 * @returns {boolean} 是否存在
 */
export function isPaperExistsWithSet(existingKeySet: any, moduleCode: string) {
  const targetKey = `${moduleCode ?? ''}`;
  return existingKeySet.has(targetKey);
}

/**
 * 合并数组（主函数）- 调用抽离的判断逻辑
 * @param {Array} newPaperList - 目标合并数组（原数组不变）
 * @param {Array} newSelectedRows - 待合并数组
 * @returns {Array} 合并后的新数组
 */
export function mergePaperLists(newPaperList: any[], newSelectedRows: any[]) {
  // 预生成Set（仅生成一次，提升批量判断性能）
  const existingKeySet = new Set(
    newPaperList.map(item => `${item.module_code ?? ''}`)
  );

  // 过滤不重复的元素：调用抽离的批量判断函数
  const uniqueNewItems = newSelectedRows.filter(item => {
    return !isPaperExistsWithSet(existingKeySet, item.module_code);
  });

  // 合并并返回新数组
  return [...newPaperList, ...uniqueNewItems];
}
