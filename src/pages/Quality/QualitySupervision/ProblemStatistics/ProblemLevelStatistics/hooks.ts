import { useEffect, useState, useCallback } from 'react';
import { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import { WBS_CODE } from '@/common/const';
import { ErrorCode } from '@/common/const';
import { SearchParams, ChartData } from './types';
import { buildApiParams, processChartData, processBranchStatisticsData, processTableData } from './problemLevelStatisticsUtils';
import { isBranchStatistics } from './problemLevelStatisticsUtils';
import { getProblemGradingLevelStatistics } from '@/services/safetyGreen/inspect/problemStatistics';

/**
 * 初始化数据获取的hook
 * 用于获取问题来源、检查单位、分公司和项目部的下拉选项数据
 * @param dispatch - redux dispatch 方法
 * @param branchCompCode - 分公司代码，用于动态加载项目部
 */
export const useInitData = (dispatch: any, branchCompCode?: string | undefined) => {
  const [obsCodeAllData, setObsCodeAllData] = useState<ObsCodeItem[]>([]);
  const [wbsOptions, setWbsOptions] = useState<any[]>([]);
  const [branchCompOptions, setBranchCompOptions] = useState<any[]>([]);
  const [projectWbsOptions, setProjectWbsOptions] = useState<any[]>([]);

  /**
   * 初始化基础数据：问题来源、检查单位、分公司
   */
  useEffect(() => {
    // 如果没有 dispatch，直接返回
    if (!dispatch) {
      return;
    }

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
        // 判断响应是否有效且有数据
        const hasValidData = res && res.rows;
        if (!hasValidData) {
          return;
        }

        // 转换数据格式并设置状态
        setObsCodeAllData(res.rows.map((item: any) => ({
          wbs_code: item.wbs_code,
          obs_code: item.obs_code,
          obs_name: item.obs_name,
          prop_key: item.prop_key,
          RowNumber: item.RowNumber,
        })));
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
        // 判断响应是否有效且有数据
        const hasValidData = res && res.rows;
        if (!hasValidData) {
          return;
        }

        // 转换数据格式并设置状态
        setWbsOptions(
          res.rows.map((item: any) => ({ value: item.wbs_code, label: item.wbs_name }))
        );
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
        // 判断响应是否有效且有数据
        const hasValidData = res && res.rows;
        if (!hasValidData) {
          return;
        }

        // 转换数据格式并设置状态
        setBranchCompOptions(
          res.rows.map((item: any) => ({ value: item.wbs_code, label: item.wbs_name }))
        );
      }
    });
  }, [dispatch]);

  /**
   * 根据分公司动态加载项目部
   */
  useEffect(() => {
    // 判断是否需要加载项目部数据：需要分公司代码和 dispatch
    const shouldLoadProjectWbs = branchCompCode && dispatch;
    if (!shouldLoadProjectWbs) {
      setProjectWbsOptions([]);
      return;
    }

    // 获取指定分公司下的项目部数据
    dispatch({
      type: 'user/queryWBS',
      payload: {
        sort: 'wbs_code',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'prop_key', Val: 'dep', Operator: '=' },
          { Key: 'up_wbs_code', Val: branchCompCode, Operator: '=' }
        ])
      },
      callback: (res: any) => {
        // 判断响应是否有效且有数据
        const hasValidData = res && res.rows;
        if (!hasValidData) {
          setProjectWbsOptions([]);
          return;
        }

        // 转换数据格式并设置状态
        setProjectWbsOptions(
          res.rows.map((item: any) => ({ value: item.wbs_code, label: item.wbs_name }))
        );
      }
    });
  }, [branchCompCode, dispatch]);

  return { obsCodeAllData, wbsOptions, branchCompOptions, projectWbsOptions };
};

/**
 * 数据获取的hook
 * 用于获取问题级别统计数据
 * @param searchParams - 搜索参数
 * @param setChartData - 设置图表数据的回调函数
 * @param setTableData - 设置表格数据的回调函数
 * @param setLastQueryParams - 设置最后查询参数的回调函数
 */
export const useFetchData = (
  searchParams: SearchParams,
  setChartData: (data: ChartData) => void,
  setTableData: (data: any[]) => void,
  setLastQueryParams: (params: SearchParams) => void
) => {
  const [loading, setLoading] = useState(false);

  /**
   * 检查接口响应是否成功
   * @param res - 接口响应对象
   * @returns 是否成功且有数据
   */
  const isResponseSuccess = (res: any): boolean => {
    const hasErrCode = res && res.errCode === ErrorCode.ErrOk;
    const hasRows = res && res.rows;
    return Boolean(hasErrCode && hasRows);
  };

  /**
   * 处理成功响应的数据
   * @param result - 接口返回的数据数组
   * @param currentParams - 当前查询参数
   */
  const handleSuccessResponse = (result: any[], currentParams: SearchParams) => {
    // 判断是否为分公司统计模式：需要选择了问题类型
    const branchStatistics = isBranchStatistics(currentParams);
    const hasProblemType = Boolean(currentParams.problemType);
    const isBranchMode = branchStatistics && hasProblemType;

    // 根据模式处理图表数据
    if (isBranchMode) {
      // 分公司统计模式：按分公司分组统计
      const chartData = processBranchStatisticsData(
        result,
        currentParams.problemType!,
        currentParams.severityLevel
      );
      setChartData(chartData);
    } else {
      // 默认模式：按问题级别分布统计
      const chartData = processChartData(result);
      setChartData(chartData);
    }

    // 处理表格数据
    const tableData = processTableData(result, currentParams);
    setTableData(tableData);

    // 保存当前查询参数
    setLastQueryParams({ ...currentParams });
  };

  /**
   * 处理失败响应：清空数据
   */
  const handleFailureResponse = () => {
    const defaultChartData = { qualityData: [0, 0, 0, 0], hseData: [0, 0, 0, 0] };
    setChartData(defaultChartData);
    setTableData([]);
  };

  /**
   * 获取统计数据
   * @param customParams - 自定义搜索参数，不传则使用当前搜索参数
   */
  const fetchData = useCallback(async (customParams?: SearchParams) => {
    setLoading(true);
    const currentParams = customParams || searchParams;
    const params = buildApiParams(currentParams);

    // 调用接口获取数据
    const res = await getProblemGradingLevelStatistics({ ...params, sort: 'problem_type' });
    const isSuccess = isResponseSuccess(res);

    // 根据响应结果处理数据
    if (isSuccess) {
      const result = res.rows || [];
      handleSuccessResponse(result, currentParams);
    } else {
      handleFailureResponse();
    }

    setLoading(false);
  }, [searchParams, setChartData, setTableData, setLastQueryParams]);

  return { loading, fetchData };
};
