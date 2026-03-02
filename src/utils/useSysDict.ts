import { ErrorCode } from '@/common/const';
import React, { useEffect, useState } from 'react';
import { getSysDict } from '@/services/contract/basic';
export interface SysDictItem {
  id: number;
  sys_type_code: string;
  dict_name: string; 
  type_name: string;
  RowNumber: number;
}

export interface ConfigData {
  [sysTypeCode: string]: SysDictItem[];
}

export interface UseSysDictProps {
  filter?: Array<{Key: string ,Val: string, Operator?: string}>;
  filterVal?: string;
}

export interface UseSysDictReturn {
  configData: ConfigData | null;
}

/**
 * 查询配置接口
 * @param {Object}
 * @returns 
 */
const useSysDict = ({ filter, filterVal = undefined }: UseSysDictProps): UseSysDictReturn => {
  const [configData, setConfigData] = useState<ConfigData | null>(null);

  /**
   * 按 sys_type_code 对字典数据进行分组
   * @param data 扁平化的字典项数组
   * @returns ConfigData 分组后的字典对象
   */
  const groupDataByCode = (data: SysDictItem[]): ConfigData => {
    return data.reduce((acc: ConfigData, item: SysDictItem) => {
      const code = item.sys_type_code;
      if (!acc[code]) {
        acc[code] = [];
      }
      acc[code].push(item);
      return acc;
    }, {});
  };

  const _getSysDict = async () => {
    // 处理兼容
    let _filter: any[] = [];
    if (filterVal) {
      _filter = [{
        "Key": "sys_type_code",
        "Val":  filterVal,
        "Operator": filterVal.split(',').length > 0 ? "in" : "="
      }]
    } else {
      _filter = filter || [];
    }
    
    // 获取后台接口请求数据
    const res: { errCode: number; rows: SysDictItem[] } = await getSysDict({
      filter: JSON.stringify(_filter),
      order: 'asc',
      sort: 'id',
    })
    if (res.errCode === ErrorCode.ErrOk) {
      const flatData = res.rows;
      // 1. 进行数据分组
      const groupedData = groupDataByCode(flatData);
      
      // 2. 更新状态
      setConfigData(groupedData);
    }
  };

  useEffect(() => {
    _getSysDict();
  }, []);

  return {
    configData
  };
};

export default useSysDict;





