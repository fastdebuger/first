import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

/**
 * 质量月报生成状态检测
 * 在当前月份已经生成月报时返回锁定标记，用于禁用其他模块的操作
 */
export const useQualityMonthlyReportLock = (dispatch?: any) => {
  const [monthlyReportLocked, setMonthlyReportLocked] = useState(false);

  // 获取锁定状态的函数
  const fetchLockStatus = useCallback(() => {
    if (!dispatch) return;

    const startTime = moment().startOf('month').unix();
    const endTime = moment().endOf('month').unix();

    dispatch({
      type: 'qualityMonthlyReport/getQualityMonthlyReport',
      payload: {
        start_time: startTime,
        end_time: endTime,
        sort: 'month_str',
        order: 'desc',
      },
      callback: (res: any) => {
        if(res && res.rows && res.rows.length > 0){
          setMonthlyReportLocked(true);
        } else {
          setMonthlyReportLocked(false);
        }
      },
    });
  }, [dispatch]);

  useEffect(() => {
    fetchLockStatus();
  }, [fetchLockStatus]);

  return { monthlyReportLocked, refreshLockStatus: fetchLockStatus };
};
