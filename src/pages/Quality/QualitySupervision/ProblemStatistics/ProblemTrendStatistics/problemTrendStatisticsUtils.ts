import { buildTimeParams } from '../problemStatisticsUtils';

/**
 * 构建接口参数
 * @param searchParams 搜索参数
 * @param timeType 时间类型：year, quarter, month
 * @returns 接口参数对象
 */
export const buildApiParams = (searchParams: any, timeType: 'year' | 'quarter' | 'month') => {
  const params: any = {
    type: timeType,
    selectWbsCode: localStorage.getItem('auth-default-wbsCode'),
  };

  // 如果传入了问题来源，则添加到参数中
  if (searchParams.problemSource) {
    params.problemObsCode = searchParams.problemSource;
  }

  // 如果传入了检查单位，则添加到参数中
  if (searchParams.examineUnit) {
    params.examineWbsCode = searchParams.examineUnit;
  }

  // 如果传入了问题类型（0:质量，1:hse），则添加到参数中
  if (searchParams.problemType != null) {
    params.problemType = searchParams.problemType;
  }

  // 如果传入了问题严重程度（0:严重问题,1:较大问题,2:一般问题,3:轻微问题），则添加到参数中
  if (searchParams.severityLevel != null) {
    params.severityLevel = searchParams.severityLevel;
  }

  // 如果传入了问题归属（0:质量管理类,1:质量实体类,2:作业行为类,3:安全管理类），则添加到参数中
  if (searchParams.problemCategory != null) {
    params.problemCategory = searchParams.problemCategory;
  }

  // 如果传入了分公司，则添加到参数中
  if (searchParams.branchCompCode) {
    params.branchCompCode = searchParams.branchCompCode;
  }

  // 合并时间参数（mints和maxts）
  Object.assign(params, buildTimeParams(searchParams.timePeriod));
  return params;
};

/**
 * 表格数据项类型定义
 */
export interface TableDataItem {
  id: number;
  serialNumber: number;
  timePeriod: string;
  totalProblems: number;
}

/**
 * 处理表格数据
 * 将接口返回的数据转换为表格所需格式
 * @param result 接口返回的数据数组
 * @returns 表格数据数组
 */
export const processTableData = (result: any[]): TableDataItem[] => {
  // 如果数据为空或不是数组，返回空数组
  if (!result || !Array.isArray(result)) {
    return [];
  }

  // 将接口数据映射为表格数据格式
  return result.map((item: any, index: number) => ({
    id: index + 1,
    serialNumber: index + 1,
    timePeriod: item?.check_date_str || '',
    totalProblems: Number(item?.item_num) || 0,
  }));
};

/**
 * 生成图表数据
 * 提取时间标签和问题数量，并按时间排序
 * @param result 接口返回的数据数组
 * @returns 图表数据对象，包含时间标签数组和问题数量数组
 */
export const generateChartData = (result: any[]): { timeLabels: string[]; problemCounts: number[] } => {
  // 如果数据为空或不是数组，返回空数据
  if (!result || !Array.isArray(result)) {
    return {
      timeLabels: [],
      problemCounts: [],
    };
  }

  // 按时间字符串排序，确保图表按时间顺序显示
  const sortedData = [...result].sort((a, b) => {
    const dateA = a?.check_date_str || '';
    const dateB = b?.check_date_str || '';
    return dateA.localeCompare(dateB);
  });

  // 提取时间标签作为x轴数据
  const timeLabels = sortedData.map((item: any) => item?.check_date_str || '');
  // 提取问题数量作为y轴数据
  const problemCounts = sortedData.map((item: any) => Number(item?.item_num) || 0);

  return {
    timeLabels,
    problemCounts,
  };
};

