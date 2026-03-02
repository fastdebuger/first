/**
 * 比较两个对象的属性 包括属性值 是否完全相同
 * var obj1 = {id:1,name:"张三"}
 * var obj2 = {id:2,name:"李四"}
 * var obj3 = {id:1,name:"张三",age:25}
 * var obj4 = {id:1,name:"张三"}
 * console.log(isObjEqual(obj1,obj2));//false
 * console.log(isObjEqual(obj1,obj3));//false
 * console.log(isObjEqual(obj1,obj4));//true
 * @param o1
 * @param o2
 */
export function isObjEqual(o1: object, o2: object) {
  const props1 = Object.getOwnPropertyNames(o1);
  const props2 = Object.getOwnPropertyNames(o2);
  if (props1.length !== props2.length) {
    return false;
  }
  for (let i = 0, max = props1.length; i < max; i += 1) {
    const propName = props1[i];
    if (o1[propName] !== o2[propName]) {
      return false;
    }
  }
  return true;
}

/**
 * 处理对象有存在undefined 的值的情况
 * @param fields
 */
export function excludeUndefinedField(fields: any) {
  const retFields: any = {};
  Object.keys(fields).forEach((key) => {
    if (fields[key] !== undefined && fields[key] !== null) {
      retFields[key] = fields[key];
    } else {
      retFields[key] = '';
    }
  });
  return retFields;
}

/**
 * 把对象中对象值转化为json
 * @param fields
 */
export function transformObjToStr(fields: object) {
  const newFields = {};
  Object.keys(fields).forEach((item: any) => {
    if (typeof fields[item] === 'object') {
      Object.assign(newFields, { [item]: JSON.stringify(fields[item]) });
    } else {
      Object.assign(newFields, { [item]: fields[item] });
    }
  });
  return newFields;
}

/**
 * 将对象中的数组值处理成字符串，或者将数组中带有str的字符串用split变成数组
 * @param data 数据源
 * @param str 数组用str join
 * @param reverse true是字符串--》数组 false是数组--》字符串
 */
export const handleArrInObj = (data: any, str: string, reverse = false) => {
  let newData = JSON.stringify(data);
  newData = JSON.parse(newData);
  if (reverse) {
    //  字符串转化为数组
    for (const [key, value] of Object.entries(newData)) {
      if (value && value.includes(str)) {
        Object.assign(newData, { [key]: newData[key].split(str) });
      }
    }
  } else {
    //  数组转换为字符串
    for (const [key, value] of Object.entries(newData)) {
      if (Array.isArray(value)) {
        Object.assign(newData, { [key]: newData[key].join(str) });
      }
    }
  }
  return newData;
};
/**
 * 深复制对象
 * @param obj
 */
export const deepObjCopy = (obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any }) => {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepObjCopy(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
};
