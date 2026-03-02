/*
  处理不同日期格式的工具类
 */

import moment from 'moment';
// 引入处理时间插件
import dayjs from 'dayjs';
/**
 * 获取当前年的第一个月 YYYY-01
 */
export function getFirstMonthOfCurrYear() {
  const date = new Date();
  const seperator1 = '-';
  const year = date.getFullYear();
  const firstMonth = `${year}${seperator1}01`;
  return firstMonth;
}

/**
 * 获取当前年的最后一天 YYYY-12
 */
export function getLastMonthOfCurrYear() {
  const date = new Date();
  const seperator1 = '-';
  const year = date.getFullYear();
  const endMonth = `${year}${seperator1}12`;
  return endMonth;
}

/**
 * 获取当前年的第一天 YYYY-01-01
 */
export function getFirstDayOfCurrYear() {
  const date = new Date();
  const seperator1 = '-';
  const year = date.getFullYear();
  const firstDate = `${year}${seperator1}01${seperator1}01`;
  return firstDate;
}

/**
 * 获取当前年的最后一天 YYYY-12-31
 */
export function getLastDayOfCurrYear() {
  const date = new Date();
  const seperator1 = '-';
  const year = date.getFullYear();
  const endDate = `${year}${seperator1}12${seperator1}31`;
  return endDate;
}

/**
 * 获取当前时间， 时间格式是 YYYY-MM-HH类型
 */
export function getCurrDay() {
  const date = new Date();
  const seperator1 = '-';
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const strDate = date.getDate();
  let newMonth = '';
  let newStrDate = '';
  if (month >= 1 && month <= 9) {
    newMonth = `0${month}`;
  } else {
    newMonth = `${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    newStrDate = `0${strDate}`;
  } else {
    newStrDate = `${strDate}`;
  }
  const currentdate = year + seperator1 + newMonth + seperator1 + newStrDate;
  return currentdate;
}

/**
 * 获取当前时间， 时间格式是 YYYY年MM月HH日类型
 */
export function getCurrDayYearMonthDay() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const strDate = date.getDate();
  let newMonth = '';
  let newStrDate = '';
  if (month >= 1 && month <= 9) {
    newMonth = `0${month}`;
  } else {
    newMonth = `${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    newStrDate = `0${strDate}`;
  } else {
    newStrDate = `${strDate}`;
  }
  const currentdate = `${year}年${newMonth}月${newStrDate}日`;
  return currentdate;
}

/**
 * 判断对象是否为Moment日期格式类型 如果是的话 转换成YYYY-MM-DD格式
 * @param obj
 */
export function isDateFormSearch(obj: any) {
  if (Object.prototype.hasOwnProperty.call(obj, '_isAMomentObject')) {
    const newVal = obj.format('YYYY-MM-DD');
    return newVal;
  }
  return '';
}

/**
 * 将日期字符串处理成moment格式
 * @param obj
 */
export function handleDateStringToMoment(obj: object | undefined) {
  if (!obj) return {};
  const newObj = obj;
  for (const [key, val] of Object.entries(obj)) {
    if (key.indexOf('date') !== -1 && val) {
      newObj[key] = moment(`${val}`);
    }
  }
  return newObj;
}

/**
 * 将时间戳处理成moment格式
 * @param obj
 */
export function handleTimeStampToMoment(obj: object | undefined) {
  if (!obj) return {};
  const newObj = obj;
  for (const [key, val] of Object.entries(obj)) {
    if ((key.indexOf('date') !== -1 || key.indexOf('time') !== -1) && val) {
      newObj[key] = moment(val);
    }
  }
  return newObj;
}

/**
 * 判断传入的日期 是不是 标准的日期格式
 * @param dateStr
 */
export function isDateFormat(dateStr: string | number) {
  const newDateStr = String(dateStr);
  const testOne = /^(\d{4})(-)(\d{2})(-)(\d{2})$/;
  const testTwo = /^(\d{4})(\/)(\d{2})(\/)(\d{2})$/;
  if (testOne.test(newDateStr) || testTwo.test(newDateStr)) {
    return true;
  }
  return false;
}

// 获取当前时区 例: 东八区 +08:00
export const getCurrTimezoneStr = () => {
  const tzArea = new Date().getTimezoneOffset() / 60;
  let result = '';
  const tzNum = Math.abs(tzArea);
  if (tzNum < 10) {
    result = `0${tzNum}:00`;
  } else {
    result = `${tzNum}:00`;
  }
  // 东时区
  if (tzArea < 0) {
    result = `+${result}`;
    // 西时区
  } else {
    result = `-${result}`;
  }
  return result;
};

/**
 * 获取当前时间的0时区 时间戳
 */
export const getTS = () => {
  const currD = new Date();
  const az = currD.getTimezoneOffset() / 60;
  const faz = az < 0 ? Math.abs(az) : -az;
  return Number(parseInt(`${currD.getTime() / 1000}`, 10) - faz * 3600);
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
 * 将0时区的时间 转换成用户所在时区的时间
 * @param timestamp
 */
export const getCurrTimeZoneDateTS = (timestamp: number) => {
  const currD = new Date();
  const az = currD.getTimezoneOffset() / 60;
  const faz = az < 0 ? Math.abs(az) : -az;
  return Number(timestamp + faz * 3600);
};

/**
 * 根据获取的0时区 时间戳
 * 显示当前时区对应的时间
 * 用于业务显示中，后台返回的时间戳，处理成用户所在的时区的时间
 * @param timestamp
 * @param format 显示格式
 */
export const showTS = (timestamp: number, format?: string) => {
  if (!timestamp) return '-';
  const showFormat = format || 'YYYY-MM-DD';
  const currD = new Date();
  const az = currD.getTimezoneOffset() / 60;
  const faz = az < 0 ? Math.abs(az) : -az;
  const currQu = Number(timestamp + faz * 3600);
  return moment.unix(currQu).format(showFormat);
};

/**
 * 日期过滤的时候
 * 处理这个日期 是当前的0时区的0点的时间戳
 * 用户日期过滤的时候，选择一个日期，根据这个日期查找数据中符合该日期的数据，用这个方法
 * @param timestamp
 */
export const checkTS = (timestamp: number) => {
  const currD = new Date();
  const az = currD.getTimezoneOffset() / 60;
  const faz = az < 0 ? Math.abs(az) : -az;
  const currT = parseInt(`${timestamp / (3600 * 24)}`, 10) * (3600 * 24);
  return currT - faz * 3600;
};

/**
 * 判断查询条件是否有日期格式
 * @param obj
 */
export function isDateFormSearchInFields(obj: any) {
  const newObj = { ...obj };
  for (const key in newObj) {
    if (key) {
      if (newObj[key] && Object.prototype.hasOwnProperty.call(newObj[key], '_isAMomentObject')) {
        const newVal = getDateTS(moment(newObj[key]).unix());
        newObj[key] = `${newVal}`;
      }
    }
  }
  return newObj;
}

/**
 * 判断数组中的对象是否日期
 * @param arr
 */
export function isDateFormSearchInArray(arr: any) {
  const newArr = [...arr] || [];
  const result: any = [];
  newArr.forEach((item) => {
    const newItem = { ...item };
    const resultItem = isDateFormSearchInFields(newItem);
    result.push(resultItem);
  });
  return result;
}

/**
 * Moment对象 =》 日期字符串
 * @param fields
 */
export function transformDateInField(fields: any) {
  const newObj = { ...fields };
  for (const key in newObj) {
    if (key) {
      if (newObj[key] && Object.prototype.hasOwnProperty.call(newObj[key], '_isAMomentObject')) {
        const newVal = getDateTS(moment(newObj[key]).unix());
        newObj[key] = newVal;
      }
    }
  }
  return newObj;
}

/**
 * 将moment 对象 =》 0时区时间戳
 * @returns 返回0时区秒级时间戳
 */
export const convertMomentToTimestamp = (momentObj: any) => {
  if (!momentObj) return null;
  // 获取的为毫秒除以1000转为秒
  /**
   * utc()将当前Moment对象的时间转换为UTC时间
   */
  return Math.floor(momentObj.utc().valueOf() / 1000);

};

/**
 * 处理moment对象为 开始时间（00:00:00）与结束时间（23:59:59）的秒级时间戳函数
 * 在作业许可证管理统计使用了该函数
 * unix()可以获取秒级时间戳
 */
export const getWorkTimestamp = (date: any, isStart: boolean) => {
  if (!date) return '';

  if (isStart) {
    return moment(date).startOf('day').unix();
  }
  // 是结束时间则为23:59:59时间
  else {
    return moment(date).endOf('day').unix();
  }
};

/**
 * 判断是日期格式还是时间戳
 * 是日期格式直接返回
 * 是时间戳处理成零时区日期格式返回
 */
export function isDateFormatOrTimeStamp(text: any, format: string) {
  const _time = Number(text);
  if (!text) return '-';
  if (Number.isNaN(_time)) {
    return text;
  } else {
    const showFormat = format || 'YYYY-MM-DD';
    const currD = new Date();
    const az = currD.getTimezoneOffset() / 60;
    const faz = az < 0 ? Math.abs(az) : -az;
    const currQu = Number(_time + faz * 3600);
    return moment.unix(currQu).format(showFormat);
  }
}

/**
 * 将两个日期差转成 “X年X个月X天” 格式（合同工期常用格式）
 * @param start 开始日期（支持 timestamp / string / Dayjs）
 * @param end   结束日期（支持 timestamp / string / Dayjs）
 * @param includeStartDay 是否包含起始日（合同当天算1天，大多数业务都算），默认 true
 * @returns string 如 "1年3个月25天" 或 "95天" 或 "-"
 */
export const formatContractDuration = (
  start: number | string | dayjs.Dayjs | null | undefined,
  end: number | string | dayjs.Dayjs | null | undefined,
  includeStartDay = true
): string => {
  if (!start || !end) return '';

  const s = dayjs(start);
  const e = dayjs(end);
  if (!s.isValid() || !e.isValid()) return '';

  let startDate = s.startOf('day');
  let endDate = e.startOf('day');

  // 如果结束日期早于开始日期，直接返回空或提示
  if (endDate.isBefore(startDate)) return '日期错误';

  // 是否包含起始日：包含则总天数 +1（大多数合同都这样算）
  const totalDays = endDate.diff(startDate, 'day') + (includeStartDay ? 1 : 0);

  if (totalDays <= 0) return '0天';

  const years = Math.floor(totalDays / 365);
  const remainAfterYear = totalDays % 365;
  const months = Math.floor(remainAfterYear / 30);
  const days = remainAfterYear % 30;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}年`);
  if (months > 0) parts.push(`${months < 10 ? '0' : ''}${months}个月`);
  parts.push(`${days < 10 ? '0' : ''}${days}天`);

  return parts.join('');
};

 /**
* 获取当前的时区tz 参数
*/
export const getTimeZoneParam = () => {
  // 获取本地时区 分钟
  const timezoneOffset = new Date().getTimezoneOffset();
  // 转换为小时 并调整符号中国时区为+8，需要正数表示
  const timezoneInHours = timezoneOffset / 60;
  // 调整符号：东时区为正，西时区为负
  return timezoneInHours < 0 ? Math.abs(timezoneInHours) : -timezoneInHours;
};
