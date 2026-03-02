import { buildTimeParams } from '../problemStatisticsUtils';
import moment from 'moment';

/**
 * 构建接口参数
 * @param searchParams 搜索参数
 * @returns 接口参数对象
 */
export const buildApiParams = (searchParams: any) => {
  const params: any = {
    selectWbsCode: localStorage.getItem('auth-default-wbsCode'),
  };

  // 问题来源参数
  if (searchParams.problemSource) {
    params.problemObsCode = searchParams.problemSource;
  }

  // 检查单位参数
  if (searchParams.examineUnit) {
    params.examineWbsCode = searchParams.examineUnit;
  }

  // 分公司参数
  if (searchParams.branchCompCode) {
    params.branchCompCode = searchParams.branchCompCode;
  }

  // 合并时间参数
  Object.assign(params, buildTimeParams(searchParams.timePeriod));
  return params;
};

/**
 * 格式化时间段显示
 * @param timePeriod 时间段数组
 * @returns 格式化后的时间段字符串
 */
export const formatTimePeriod = (timePeriod: [moment.Moment, moment.Moment] | undefined): string => {
  if (!timePeriod || !timePeriod[0] || !timePeriod[1]) {
    return '';
  }
  const start = timePeriod[0].format('YYYY-MM-DD');
  const end = timePeriod[1].format('YYYY-MM-DD');
  return `${start} 至 ${end}`;
};

/**
 * 表格数据项类型定义
 */
export interface TableDataItem {
  id: number;
  serialNumber: number;
  timePeriod: string;
  questionCategory: string;
  itemNum: number;
}

/**
 * 处理表格数据
 * @param result 接口返回的数据数组
 * @param searchParams 搜索参数
 * @returns 表格数据数组
 */
export const processTableData = (
  result: any[],
  searchParams: {
    timePeriod: [moment.Moment, moment.Moment] | undefined;
  }
): TableDataItem[] => {
  // 数据为空时返回空数组
  if (!result || !Array.isArray(result)) {
    return [];
  }

  // 格式化时间段
  const timePeriodStr = formatTimePeriod(searchParams.timePeriod);

  // 按问题类别分组统计
  const categoryMap = new Map<string, number>();

  result.forEach((item: any) => {
    const category = item?.question_category_str || '';
    const itemNum = Number(item?.item_num) || 0;

    if (category) {
      const currentValue = categoryMap.get(category) || 0;
      categoryMap.set(category, currentValue + itemNum);
    }
  });

  // 转换为数组，按问题类别排序
  const sortedCategories = Array.from(categoryMap.keys()).sort();
  return sortedCategories.map((category, index) => ({
    id: index + 1,
    serialNumber: index + 1,
    timePeriod: timePeriodStr,
    questionCategory: category,
    itemNum: categoryMap.get(category) || 0,
  }));
};

/**
 * 生成图表数据
 * @param result 接口返回的数据数组
 * @returns 图表数据对象
 */
export const generateChartData = (result: any[]): any => {
  // 数据为空时返回空数据
  if (!result || !Array.isArray(result)) {
    return {
      categoryNames: [],
      itemNums: [],
    };
  }

  // 按问题类别分组统计
  const categoryMap = new Map<string, number>();

  result.forEach((item: any) => {
    const category = item?.question_category_str || '';
    const itemNum = Number(item?.item_num) || 0;

    if (category) {
      const currentValue = categoryMap.get(category) || 0;
      categoryMap.set(category, currentValue + itemNum);
    }
  });

  // 转换为数组，按问题类别排序
  const sortedCategories = Array.from(categoryMap.keys()).sort();
  const categoryNames = sortedCategories;
  const itemNums = sortedCategories.map(category => categoryMap.get(category) || 0);

  return {
    categoryNames,
    itemNums,
  };
};

