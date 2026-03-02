import { arrToTree } from '@/utils/utils-array';
import { useCallback, useEffect, useState } from 'react';
import { getDvaApp } from 'umi';
import _ from 'lodash';


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




interface FilterParams {
  obs_codes?: string[];
  wbs_codes?: string[];
  prop_key?: string;
}

/**
 * 根据 WBS 和 OBS 编码过滤获取用户列表
 */
export function useFilteredRiskUsers(initialParams?: FilterParams) {
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 维护过滤状态
  const [queryParams, setQueryParams] = useState<FilterParams>({
    obs_codes: initialParams?.obs_codes || [],
    wbs_codes: initialParams?.wbs_codes || [],
    // prop_key: initialParams?.prop_key || PROP_KEY
  });

  const dispatch = getDispatch();

  const fetchUsers = useCallback(() => {
    if (!dispatch) return;

    setLoading(true);

    // 1. 使用 lodash 构建动态 filter 数组
    const filterArray = _.compact([
      // 处理 obs_code 过滤
      !_.isEmpty(queryParams.obs_codes) && {
        Key: "obs_code",
        Operator: "in",
        Val: `'${queryParams.obs_codes?.join("','")}'`
      },
      // 处理 wbs_code 过滤
      !_.isEmpty(queryParams.wbs_codes) && {
        Key: "wbs_code",
        Operator: "in",
        Val: `'${queryParams.wbs_codes?.join("','")}'`
      }
    ]);

    dispatch({
      type: 'common/queryUserInfo',
      payload: {
        sort: 'user_code',
        order: 'asc',
        idNoNotNull: 1,
        offset: 1,
        limit: 2000, // 增加上限以支持多选部门
        filter: JSON.stringify(filterArray),
        // prop_key: queryParams.prop_key || PROP_KEY,
        // // 如果后端要求必须传基础代码，则取第一个或默认值
        // obs_code: queryParams.obs_codes?.[0] || DEFAULT_DEP,
        // selectWbsCode: queryParams.wbs_codes?.[0] || DEFAULT_WBS,
      },
      callback(res: any) {
        setLoading(false);
        const rows = res?.rows || [];
        if (rows.length > 0) {
          const result = rows.map((i: any) => ({
            ...i,
            label: `${i.user_name}(${i.user_code})`,
            value: i.user_code,
            // 关键：保留部门属性，方便后续在 TreeSelect 中挂载
            dep_code: i.obs_code || i.wbs_code
          }));
          setUserList(result);
        } else {
          setUserList([{ label: "未找到相关人员", value: "NONE", disabled: true }]);
        }
      }
    });
  }, [queryParams, dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    userList,
    loading,
    queryParams,
    setQueryParams,
    refresh: fetchUsers
  };
}