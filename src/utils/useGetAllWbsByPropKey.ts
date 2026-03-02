import { useEffect, useState } from 'react';
import { arrToTree } from '@/utils/utils-array';

/**
 * WBS 数据结构类型
 * wbsItems: 转换后的树形 WBS 结构数组
 * loading: 数据加载状态
 */
type IWbsType = {
  wbsItems: any[];
  wbsTreeData: any[];
  loading: boolean;
}

/**
 * 用于获取WBS（工作分解结构）
 * @param dispatch Redux/UmiJS 等状态管理框架的 dispatch 函数，用于触发异步 Action。
 * @param propKey 根据曾经查询
 * @returns {IWbsType} 包含 wbsItems (树形 WBS 数据) 和 loading (加载状态) 的对象。
 */
export default function useWbsData(dispatch: any, propKey: string): IWbsType {
  // 存储 WBS 一维结构数据
  const [wbsItems, setWbsItems] = useState<any[]>([]);
  // 存储 WBS 树形结构数据
  const [wbsTreeData, setWbsTreeData] = useState<any[]>([]);
  // 存储加载状态
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 设置加载状态为 true
    setLoading(true);

    dispatch({
      type: 'common/queryWbsByUserCanSwitch',
      payload: {
        sort: 'serial_no asc,wbs_code',
        order: 'asc',
        filter: propKey ? JSON.stringify([
          {
            Key: 'prop_key',
            Val: propKey, // "'branchComp', 'subComp', 'dep'",
            Operator: 'in'
          },
        ]) : JSON.stringify([]),
      },
      callback: (res: any) => {
        setLoading(false);
        // 确定树形结构转换的起始点 ID
        const startId = res.rows.find((item: any) => !item.up_wbs_code)?.up_wbs_code;

        // 将筛选后的扁平数组转换为树形结构
        const tree: any = arrToTree(res.rows, 'wbs_code', 'up_wbs_code', 'children', startId);

        setWbsTreeData(tree || []);
        setWbsItems(res.rows || [])
      },
    });
  }, []);

  return {
    wbsItems,
    loading,
    wbsTreeData
  }
}
