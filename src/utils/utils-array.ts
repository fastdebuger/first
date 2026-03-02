/*
  处理不同数组格式的工具类
 */

import { isObjEqual } from '@/utils/utils-object';

/**
 * 判断数组中 是否存在对应的元素
 * @param arr ['1', '2', '3', '4', '5'] 数组为一维数组，每一项是基本类型格式
 * @param key
 */
export function isExistArr(arr: any, key: any) {
  let flag = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === key) {
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 判断item的属性 是否等于 数组arr中的元素的某一个属性
 * @param arr
 * @param item
 * @param arrKey
 * @param itemKey
 */
export function isExistArrDiffFieldReturnBoolean(
  arr: object[],
  item: object,
  arrKey: string,
  itemKey: string,
) {
  let flag = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][arrKey] === item[itemKey]) {
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 判断数组中，存在对象中的某个属性
 * @param arr   对象形数组
 * @param item  过滤的对象
 * @param key   字段名
 */
export function isExistArrReturnBoolean(arr: object[], item: object, key: string) {
  let flag = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][key] === item[key]) {
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 判断数组中，存在对象中的某个属性
 * @param arr   对象形数组
 * @param item  过滤的对象
 * @param key   字段名
 */
export function isExistArrReturnIndexOneKey(arr: object[], item: object, key: string) {
  let backIndex = -1;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][key] === item[key]) {
      backIndex = i;
      break;
    }
  }
  return backIndex;
}

/**
 * 判断数组中，存在对象中的某个属性
 * @param arr   对象形数组
 * @param item  过滤的对象
 * @param key1   字段名
 * @param key2   字段名
 */
export function isExistArrReturnIndex(arr: object[], item: object, key1: string, key2: string) {
  let backIndex = -1;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][key1] === item[key1] && arr[i][key2] === item[key2]) {
      backIndex = i;
      break;
    }
  }
  return backIndex;
}

/**
 * 判断是否存在该属性 并将数组中原属性替换成 新属性， 如果没有的话则追加到里面
 * @param arr
 * @param item
 * @param key
 */
export function isExistFieldAndExchangeNewField(arr: any[], item: object, key: string) {
  let flag = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][key] === item[key]) {
      Object.assign(arr[i], item);
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 判断是否存在key1, key2两个属性 并将数组中原属性替换成 新属性
 * @param arr
 * @param item
 * @param key1
 * @param key2
 */
export function isExistSecondKeyAndExchangeNewField(
  arr: any[],
  item: object,
  key1: string,
  key2: string,
) {
  let flag = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][key1] === item[key1] && arr[i][key2] === item[key2]) {
      Object.assign(arr[i], item);
      flag = true;
      break;
    }
  }
  return flag;
}

/**
 * 在数组中 发现元素 并替换它
 * @param arr
 * @param item
 * @param key
 */
export function findFieldAndExchangeNewField(arr: any[], item: object, key: string) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][key] === item[key]) {
      Object.assign(arr[i], item);
      break;
    }
  }
}

/**
 * 深拷贝数组 [{}, {}]
 * @param arr
 */
export function deepArr(arr: any) {
  const newArr = arr || [];
  const result: any = [];
  newArr.forEach((item: any) => {
    const newItem = { ...item };
    result.push(newItem);
  });
  return result;
}

/**
 * 一维数组转换为二维数组
 * @param num
 * @param arr
 */
export function arrTrans(num: number, arr: any) {
  // 一维数组转换为二维数组
  const iconsArr: any = []; // 声明数组
  arr.forEach((item: any, index: number) => {
    const page = Math.floor(index / num); // 计算该元素为第几个素组内
    if (!iconsArr[page]) {
      // 判断是否存在
      iconsArr[page] = [];
    }
    iconsArr[page].push(item);
  });
  return iconsArr;
}

/**
 * 遍历对象数组，返回字符串数组
 * key对应的值相同的剔除掉
 * @param arr
 * @param key
 */
export const uniqueMethod = (arr: any[], key: string) => {
  const result: string[] = [];
  const copyArr = [...arr];
  copyArr.forEach((item: any) => {
    if (key) {
      if (result.includes(item[key])) return;
      if (!item[key]) return;
      result.push(item[key]);
    }
  });
  return result;
};

/**
 * 遍历对象数组，返回数组 [{value: ''}]
 * key对应的值相同的剔除掉
 * @param arr
 * @param key
 */
export const uniqueAutoComponentMethod = (arr: any[], key: string) => {
  // @ts-ignore
  const result: string[{ value: any }] = [];
  const copyArr = [...arr];
  copyArr.forEach((item: any) => {
    const findIndex = result.findIndex((valItem: any) => valItem.value === item[key]);
    if (findIndex < 0) {
      result.push({
        value: item[key],
      });
    }
  });
  return result;
};

/**
 * 数组去重
 * @param arr
 */
export const uniqueArr = (arr: string[]) => {
  const newArr = arr.filter((item) => item);
  return Array.from(new Set(newArr));
};

/**
 * 字符串数组去重后用，拼接
 * @param arr
 * @param symbol
 */
export const joinArr = (arr: string[], symbol: string = ',') => {
  const newArr = arr.filter((item) => item);
  return Array.from(new Set(newArr)).join(symbol);
};

/**
 * 获取目标数组target中，不同于源数组origin的新增的元素
 */
export const getAddItems = (origin: any[], target: any[], key: string) => {
  const filterAddItems: any[] = [];
  target.forEach((sourceItem: any) => {
    if (!isExistArrReturnBoolean(origin, sourceItem, key)) {
      filterAddItems.push(sourceItem);
    }
  });
  return filterAddItems;
};

/**
 * 判断 是否存在数组中 并且判断item的每一项 与 原数组arr中的item的每一项是否一样
 * @param arr
 * @param item
 * @param key
 */
export const isExistArrAndIsChanged = (arr: object[], item: object, key: string) => {
  let flag = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][key] === item[key]) {
      flag = !isObjEqual(arr[i], item);
    }
  }
  return flag;
};

/**
 * 获取目标数组target中，不同于源数组origin的修改的元素
 */
export const getEditItems = (origin: any[], target: any[], key: string) => {
  const filterEditItems: any[] = [];
  origin.forEach((oldItem: any) => {
    const filterArr = target.filter((sourceItem: any) => sourceItem[key] === oldItem[key]);
    // 如果查询出来有结果 并且 判断 当前过滤的对象 有属性发生改变的话
    if (filterArr.length > 0 && isExistArrAndIsChanged(origin, filterArr[0], key)) {
      filterEditItems.push(filterArr[0]);
    }
  });
  return filterEditItems;
};

/**
 * 获取目标数组target中，不同于源数组origin的删除的元素
 */
export const getDelItems = (origin: any[], target: any[], key: string) => {
  const filterDelItems: any[] = [];
  origin.forEach((oldItem: any) => {
    if (!isExistArrReturnBoolean(target, oldItem, key)) {
      filterDelItems.push(oldItem);
    }
  });
  return filterDelItems;
};

/**
 * 判断数组中是否有重复数据
 * @param arr
 */
export function isRepeat(arr: any[]) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr.indexOf(arr[i]) !== i) {
      return true;
    }
  }
  return false;
}

/**
 * 一位数组 转 树形结构
 * @param arr
 * @param upKey // 根结点 字段名
 * @param upValue // 根结点 字段值
 * @param childKey // 子节点 字段名
 */
export const arrayToTree = (arr: any[], upKey: string, upValue: any, childKey: string) => {
  return arr.reduce((res, current) => {
    if (current[upKey] === upKey) {
      current.children = arrayToTree(arr, upKey, current[childKey], childKey);
      return res.concat(current);
    }
    return res;
  }, []);
};

/**
 * 分组 一维数组
 * @param arr
 * @param groupNameKey 分组字段
 * @param groupOrderKey 排序字段
 */
export const groupArr = (arr: any[], groupNameKey: string, groupOrderKey: string) =>
  arr
    .sort((a, b) => (a[groupOrderKey] < b[groupOrderKey] ? -1 : 1))
    .reduce((newArr, obj, i) => {
      if (0 === i) return [[obj]];
      if (obj[groupNameKey] === newArr[newArr.length - 1][0][groupNameKey])
        return newArr[newArr.length - 1].push(obj), newArr;
      return [...newArr, [obj]];
    }, []);

/**
* 一维数组转为树形结构的方法
* @param arr 要转换的一维数组
* @param idKey 根节点的字段名
* @param fidKey 子节点（用来判断是哪一个根节点的children）字段名
* @param childKey 子节点数组的字段名，默认children，如({id: 5, fid: 1, name: "", children: []})
* @param startFid 起始的根节点的字段值 (如{id: 5, fid: 0, name: "", children: []}是根节点，它的fid是0，就传0)
*/
export const arrToTree = (arr: any[], idKey: string, fidKey: string, childKey: string = 'children', startFid: any = 0) => {
  function updateChildren(node) {
    const children = arr.filter(item => item[fidKey] === node[idKey]);
    if (children.length === 0) return;
    node[childKey] = [];
    children.forEach(item => {
      const temp = { ...item, parent: node, key: item.id };
      updateChildren(temp);
      node[childKey].push(temp);
    });
  }

  const result: any[] = [];
  const top = arr.filter(item => item[fidKey] === startFid);
  top.forEach(item => {
    const temp = { ...item, key: item.id };
    updateChildren(temp);
    result.push(temp);
  });
  return result;
}
 /* 
  * 从树型结构中找子节点
  * 用法：传入树 + 路径 + 字段名，自动处理空路径（即直接返回整个树）
  * @param tree 树型结构根节点 数组格式
  * @param names 节点路径数组
  * @param nameKey 需要处理的label字段
  * 
  * @returns {label: string, value: string} 对象数组
  */
export const getChildren = (
  tree: any[],
  path: (string | number)[] = [],
  options: {
    nameKey?: string;
    idKey?: string;
    valueAs: 'id' | 'name';  // 必须显式指定！
  }
): { label: string; value: string | number }[] => {
  const { nameKey = 'dict_name', idKey = 'id', valueAs } = options;

  let current: any[] = tree;

  /**
 * 根据指定路径查找树形结构中的目标节点层
 * 
 * @param path - 查找路径，可以是数字或字符串类型的数组，用于逐层定位节点
 * @param current - 当前层级的节点数组，作为查找的起始点
 * @param idKey - 用于匹配数字类型路径的节点属性名，默认为 'id'
 * @param nameKey - 用于匹配字符串类型路径的节点属性名，默认为 'name'
 * 
 * @returns 返回找到的目标节点层的子节点数组，如果路径中任何一级节点不存在或无children属性则返回空数组
 */
  for (const key of path) {
    // 根据路径中的键值查找当前层级的目标节点
    const node = current.find((n: any) => {
      // 检查指定键对应的值是否与给定的数字类型key相等
      // @param key - 要比较的数值键
      // @param n - 包含idKey属性的对象
      // @param idKey - 用于访问对象n中对应值的键名
      // @returns 如果对象n中idKey对应的值严格等于key则返回true，否则返回false
      if (typeof key === 'number') {
        return n[idKey] === key;
      }
      return n[nameKey] === key;
    });

    // 如果找不到节点或节点没有子节点，则返回空数组
    if (!node?.children) return [];
    current = node.children;
  }

  // 2. 返回当前层的子节点，按照传参决定 value 是 id 还是 name
  return current.map((node: any) => ({
    label: node[nameKey] || '',
    value: valueAs === 'id'
      ? (node[idKey] ?? node[nameKey])
      : node[nameKey]
  }));
};
