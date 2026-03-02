import { useEffect, useState } from 'react';
import { arrToTree } from '@/utils/utils-array';

/**
 * WBS 数据结构类型
 * wbsItems: 转换后的树形 WBS 结构数组
 * loading: 数据加载状态
 */
type IWbsType = {
  wbsItems: any[];
  loading: boolean;
}

/**
 * 用于获取WBS（工作分解结构）
 * @param dispatch Redux/UmiJS 等状态管理框架的 dispatch 函数，用于触发异步 Action。
 * @returns {IWbsType} 包含 wbsItems (树形 WBS 数据) 和 loading (加载状态) 的对象。
 */
export default function useWbsData(dispatch: any): IWbsType {
  // 存储 WBS 树形结构数据
  const [wbsItems, setWbsItems] = useState<any[]>([]);
  // 存储加载状态
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 设置加载状态为 true
    setLoading(true);

    dispatch({
      type: 'common/queryWBS',
      payload: {
        sort: 'serial_no asc,wbs_code',
        order: 'asc',
        filter: JSON.stringify([
          {
            Key: 'prop_key',
            Val: "'branchComp', 'subComp', 'dep'",
            Operator: 'in'
          },
          {
            Key: 'wbs_code',
            Val: localStorage.getItem("auth-current-wbs-full-code") + "%",
            Operator: 'like'
          }
        ]),
      },
      callback: (res: any) => {
        const optvalue = res?.rows.filter((item: any) => {
          // 父级节点禁止选中
          if (item.prop_key === 'branchComp' || item.prop_key === 'subComp') {
            // item.disabled = true
          }
          return (
            item.prop_key === 'branchComp' || item.prop_key === 'subComp' || item.prop_key === 'dep'
          );
        });

        setLoading(false);

        // 确定树形结构转换的起始点 ID
        const startId = optvalue.find((item: any) =>
          item.wbs_code === localStorage.getItem('auth-default-wbsCode')
        )?.up_wbs_code;

        // 将筛选后的扁平数组转换为树形结构
        const tree: any = arrToTree(optvalue, 'wbs_code', 'up_wbs_code', 'children', startId);

        setWbsItems(tree || []);
      },
    });
  }, []);

  return {
    wbsItems,
    loading
  }
}
