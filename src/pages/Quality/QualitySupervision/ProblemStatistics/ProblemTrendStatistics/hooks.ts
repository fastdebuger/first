import { useEffect, useState } from 'react';
import { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import { WBS_CODE } from '@/common/const';

/**
 * 初始化数据获取的hook
 * 用于获取问题来源、检查单位和分公司的下拉选项数据
 */
export const useInitData = (dispatch: any) => {
  const [obsCodeAllData, setObsCodeAllData] = useState<ObsCodeItem[]>([]);
  const [wbsOptions, setWbsOptions] = useState<any[]>([]);
  const [branchCompOptions, setBranchCompOptions] = useState<any[]>([]);

  useEffect(() => {
    if (dispatch) {
      // 获取obs数据（问题来源数据）
      dispatch({
        type: 'user/getObsCode',
        payload: {
          sort: 'obs_code',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' },
          ])
        },
        callback: (res: any) => {
          if (res && res.rows) {
            setObsCodeAllData(res.rows.map((item: any) => ({
              wbs_code: item.wbs_code,
              obs_code: item.obs_code,
              obs_name: item.obs_name,
              prop_key: item.prop_key,
              RowNumber: item.RowNumber,
            })));
          }
        }
      });

      // 获取所有项目部数据（检查单位）
      dispatch({
        type: 'user/queryWBS',
        payload: {
          sort: 'wbs_code',
          order: 'asc',
          filter: JSON.stringify([{ Key: 'prop_key', Val: 'dep', Operator: '=' }])
        },
        callback: (res: any) => {
          if (res && res.rows) {
            setWbsOptions(
              res.rows.map((item: any) => ({ value: item.wbs_code, label: item.wbs_name }))
            );
          }
        }
      });

      // 获取分公司数据
      dispatch({
        type: 'user/queryWBS',
        payload: {
          sort: 'wbs_code',
          order: 'asc',
          filter: JSON.stringify([{ Key: 'prop_key', Val: 'subComp', Operator: '=' }])
        },
        callback: (res: any) => {
          if (res && res.rows) {
            setBranchCompOptions(
              res.rows.map((item: any) => ({ value: item.wbs_code, label: item.wbs_name }))
            );
          }
        }
      });
    }
  }, [dispatch]);

  return { obsCodeAllData, wbsOptions, branchCompOptions };
};

