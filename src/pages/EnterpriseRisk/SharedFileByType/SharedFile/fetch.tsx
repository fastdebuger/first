import { arrToTree } from '@/utils/utils-array';
import { useEffect, useState } from 'react';
import { getDvaApp } from 'umi';

const ROOT_OBS_CODE = '';
const DEFAULT_WBS = localStorage.getItem('auth-default-wbsCode');
const DEFAULT_DEP = localStorage.getItem("auth-default-cpecc-depCode");

/**
 * 过滤并转换 OBS 数据
 */
const formatObsData = (rows: any[]) => {
  if (!rows?.length) return [];

  return rows
    .map(i => ({
      ...i,
      title: i.obs_name,
      value: i.obs_code,
      key: i.obs_code,
      label: i.obs_name,
    }));
};

const getDispatch = () => getDvaApp()?._store?.dispatch;

/**
 * 获取所有 OBS 树形数据
 */
export function useObsTree(payload = {}) {
  const [responsList, setResponsList] = useState<any[]>([]);
  const dispatch = getDispatch();

  useEffect(() => {
    if (!dispatch) return;

    dispatch({
      type: 'common/queryObs',
      payload: {
        sort: 'serial_no asc,obs_code',
        order: 'asc',
        wbsCode: DEFAULT_WBS,
        filter: JSON.stringify([]),
        ...payload
      },
      callback: (res: any) => {
        const formatted = formatObsData(res.rows);
        const tree = arrToTree(formatted, 'obs_code', 'up_obs_code', 'children', ROOT_OBS_CODE);
        setResponsList(tree?.map((i: any) => ({ ...i, disabled: false })) || []);
      },
    });
  }, [JSON.stringify(payload)]);

  return { responsList };
}

/**
 * 根据 OBS 获取用户列表
 */
export function useWbsUsers(initialObsCode?: string) {
  const [wbsUserList, setWbsUserList] = useState<any[]>([]);
  const [observationObsCode, setObservationObsCode] = useState({
    obs_code: initialObsCode,
    prop_key: ""
  });
  const dispatch = getDispatch();

  useEffect(() => {
    const targetObsCode = observationObsCode.obs_code || DEFAULT_DEP;
    if (!dispatch || !targetObsCode) return;

    // 请求前置清空或设置加载状态
    setWbsUserList([]);

    dispatch({
      type: 'common/queryUserInfo',
      payload: {
        sort: 'user_code',
        order: 'asc',
        idNoNotNull: 1,
        offset: 1,
        limit: 1500,
        obs_code: targetObsCode,
        selectWbsCode: DEFAULT_WBS,
        prop_key: observationObsCode.prop_key,
        filter: JSON.stringify([]),
      },
      callback(res: any) {
        const rows = res?.rows || [];
        if (rows.length > 0) {
          const result = rows.map((i: any) => ({
            ...i,
            label: `${i.user_name}(${i.user_code})`,
            value: i.user_code
          }));
          setWbsUserList(result);
        } else {
          setWbsUserList([{ label: "暂无数据", value: "NONE", disabled: true }]);
        }
      }
    });
  }, [observationObsCode]);

  return {
    wbsUserList,
    observationObsCode,
    setObservationObsCode
  };
}


type IWbsType = {
  wbsItems: any[];
  loading: boolean;
}

/**
 * 获取WBS
 * @param dispatch 
 * @returns {IWbsType} 包含 wbsItems (树形 WBS 数据) 和 loading (加载状态) 的对象。
 */
export function useWbsTreeData(): IWbsType {
  const [wbsItems, setWbsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = getDispatch();
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
        const formatted = formatObsData(res?.rows);
        console.log(333, formatted)
        const optvalue = formatted.filter((item: any) => {
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