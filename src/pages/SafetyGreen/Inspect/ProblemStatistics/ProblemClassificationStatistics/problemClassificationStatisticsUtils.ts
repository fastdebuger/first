import { buildTimeParams } from '../problemStatisticsUtils';
import moment from 'moment';

/**
 * 问题归类标签映射配置
 * 0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
 */
const CATEGORY_LABEL_MAP: Record<string, string> = {
  '0': '质量管理类',
  '1': '质量实体类',
  '2': '作业行为类',
  '3': '安全管理类',
};

/**
 * 问题归类字段映射配置
 * 0:质量管理类 -> quality_factor_num
 * 1:质量实体类 -> entity_item_num
 * 2:作业行为类 -> operation_item_num
 * 3:安全管理类 -> safety_factor_num
 */
const CATEGORY_FIELD_MAP: Record<string, string> = {
  '0': 'quality_factor_num',
  '1': 'entity_item_num',
  '2': 'operation_item_num',
  '3': 'safety_factor_num',
};

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

  // 问题类型参数
  if (searchParams.problemType) {
    params.problemType = searchParams.problemType;
  }

  // 问题归类参数：0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
  if (searchParams.problemCategory) {
    params.problemCategory = searchParams.problemCategory;
  }

  // 合并时间参数
  Object.assign(params, buildTimeParams(searchParams.timePeriod));
  return params;
};

/**
 * 根据问题归类获取对应的标签名
 * @param problemCategory 问题归类：0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
 * @returns 对应的标签名
 */
export const getCategoryLabel = (problemCategory: string | undefined): string => {
  if (!problemCategory) {
    return '';
  }
  return CATEGORY_LABEL_MAP[problemCategory] || '';
};

/**
 * 根据问题归类获取对应的字段名
 * @param problemCategory 问题归类：0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
 * @returns 对应的字段名
 */
export const getCategoryField = (problemCategory: string | undefined): string | null => {
  if (!problemCategory) {
    return null;
  }
  return CATEGORY_FIELD_MAP[problemCategory] || null;
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
 * 格式化问题类型显示
 * @param problemType 问题类型：0-质量, 1-HSE
 * @returns 格式化后的问题类型字符串
 */
export const formatProblemType = (problemType: string | undefined): string => {
  if (problemType === '0' || problemType === 0) {
    return '质量';
  }
  if (problemType === '1' || problemType === 1) {
    return 'HSE';
  }
  return '';
};

/**
 * 生成图表数据（选择了问题归类时）
 * @param result 接口返回的数据数组
 * @param problemCategory 问题归类
 * @returns 图表数据对象
 */
const generateCategoryChartData = (result: any[], problemCategory: string): any => {
  const fieldName = getCategoryField(problemCategory);
  const categoryLabel = getCategoryLabel(problemCategory);

  // 根据问题归类确定问题类型
  const isQualityCategory = problemCategory === '0' || problemCategory === '1';
  const problemType = isQualityCategory ? '质量' : 'HSE';

  // 累加所有数据项的对应字段值
  let totalQuantity = 0;
  result.forEach((item: any) => {
    const value = Number(item?.[fieldName!]) || 0;
    totalQuantity += value;
  });

  return {
    typeNames: [problemType],
    categoryData: [totalQuantity],
    categoryLabel: categoryLabel,
    hasCategoryData: true,
    qualityData: [],
    hseData: [],
    hasQualityData: false,
    hasHseData: false,
  };
};

/**
 * 生成图表数据（未选择问题归类时）
 * @param result 接口返回的数据数组
 * @param problemType 问题类型
 * @returns 图表数据对象
 */
const generateQualityHseChartData = (result: any[], problemType: string | undefined): any => {
  // 如果选择了质量类型，显示质量管理类和质量实体类
  if (problemType === '0') {
    let qualityManagementTotal = 0; // quality_factor_num
    let qualityEntityTotal = 0; // entity_item_num

    result.forEach((item: any) => {
      qualityManagementTotal += Number(item?.quality_factor_num) || 0;
      qualityEntityTotal += Number(item?.entity_item_num) || 0;
    });

    return {
      typeNames: ['质量管理类', '质量实体类'],
      categoryData: [qualityManagementTotal, qualityEntityTotal],
      categoryLabel: '',
      hasCategoryData: false,
      singleData: [qualityManagementTotal, qualityEntityTotal],
      singleColors: ['#5470c6', '#5470c6'], // 都用蓝色
      hasQualityData: true,
      hasHseData: false,
    };
  }

  // 如果选择了HSE类型，显示安全管理类和作业行为类
  if (problemType === '1') {
    let safetyManagementTotal = 0; // safety_factor_num
    let operationBehaviorTotal = 0; // operation_item_num

    result.forEach((item: any) => {
      safetyManagementTotal += Number(item?.safety_factor_num) || 0;
      operationBehaviorTotal += Number(item?.operation_item_num) || 0;
    });

    return {
      typeNames: ['安全管理类', '作业行为类'],
      categoryData: [safetyManagementTotal, operationBehaviorTotal],
      categoryLabel: '',
      hasCategoryData: false,
      singleData: [safetyManagementTotal, operationBehaviorTotal],
      singleColors: ['#91cc75', '#91cc75'], // 都用绿色
      hasQualityData: false,
      hasHseData: true,
    };
  }

  // 没有选择问题类型，显示质量和HSE两个类别，每个类别一条柱状图
  let qualityTotal = 0;
  let hseTotal = 0;

  result.forEach((item: any) => {
    // 获取问题类型
    const itemProblemType = item?.problem_type;
    const isQuality = itemProblemType === 0 || itemProblemType === '0';
    const isHse = itemProblemType === 1 || itemProblemType === '1';

    // 分别累加质量和HSE总数
    if (isQuality) {
      const value = Number(item?.quality_all_num) || 0;
      qualityTotal += value;
    } else if (isHse) {
      const value = Number(item?.safety_all_num) || 0;
      hseTotal += value;
    } else {
      // 问题类型不明确，同时累加质量和HSE（兼容处理）
      const qualityValue = Number(item?.quality_all_num) || 0;
      const hseValue = Number(item?.safety_all_num) || 0;
      qualityTotal += qualityValue;
      hseTotal += hseValue;
    }
  });

  return {
    typeNames: ['质量', 'HSE'],
    categoryData: [qualityTotal, hseTotal],
    categoryLabel: '',
    hasCategoryData: false,
    singleData: [qualityTotal, hseTotal],
    singleColors: ['#5470c6', '#91cc75'],
    hasQualityData: true,
    hasHseData: true,
  };
};

/**
 * 生成图表数据
 * @param result 接口返回的数据数组
 * @param problemCategory 问题归类
 * @param problemType 问题类型
 * @returns 图表数据对象
 */
export const generateChartData = (
  result: any[],
  problemCategory: string | undefined,
  problemType: string | undefined
): any => {
  // 数据为空时返回空数据
  if (!result || !Array.isArray(result)) {
    return {
      typeNames: [],
      categoryData: [],
      categoryLabel: '',
      hasCategoryData: false,
      qualityData: [],
      hseData: [],
      hasQualityData: false,
      hasHseData: false,
    };
  }

  // 如果选择了问题归类，生成单个系列的图表数据
  if (problemCategory) {
    return generateCategoryChartData(result, problemCategory);
  }

  // 如果没有选择问题归类，生成质量和HSE两个系列的图表数据
  return generateQualityHseChartData(result, problemType);
};

/**
 * 表格数据项类型定义
 */
export interface TableDataItem {
  id: number;
  serialNumber: number;
  timePeriod: string;
  problemType: string;
  secondaryTerm?: string;
  problemQuantity: number;
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
    problemCategory: string | undefined;
  }
): TableDataItem[] => {
  // 数据为空时返回空数组
  if (!result || !Array.isArray(result)) {
    return [];
  }

  // 格式化时间段
  const timePeriodStr = formatTimePeriod(searchParams.timePeriod);

  // 如果选择了问题归类，显示对应的名字和数量
  if (searchParams.problemCategory) {
    const categoryLabel = getCategoryLabel(searchParams.problemCategory);
    const categoryField = getCategoryField(searchParams.problemCategory);

    // 根据问题归类确定问题类型
    const isQualityCategory = searchParams.problemCategory === '0' || searchParams.problemCategory === '1';
    const problemType = isQualityCategory ? '质量' : 'HSE';

    // 累加所有数据项的对应字段值
    let totalQuantity = 0;
    result.forEach((item: any) => {
      const value = Number(item?.[categoryField!]) || 0;
      totalQuantity += value;
    });

    return [
      {
        id: 1,
        serialNumber: 1,
        timePeriod: timePeriodStr,
        problemType: problemType,
        secondaryTerm: categoryLabel,
        problemQuantity: totalQuantity,
      },
    ];
  }

  // 如果没有选择问题归类，不展示二级检索词
  // 按问题类型分组统计
  const qualityTotal = result.reduce((sum, item) => {
    const itemProblemType = item?.problem_type;
    const isQuality = itemProblemType === 0 || itemProblemType === '0';
    if (isQuality) {
      return sum + (Number(item?.quality_all_num) || 0);
    }
    return sum;
  }, 0);

  const hseTotal = result.reduce((sum, item) => {
    const itemProblemType = item?.problem_type;
    const isHse = itemProblemType === 1 || itemProblemType === '1';
    if (isHse) {
      return sum + (Number(item?.safety_all_num) || 0);
    }
    return sum;
  }, 0);

  const tableData: TableDataItem[] = [];
  let serialNumber = 1;

  // 显示质量行（即使值为0也显示）
  tableData.push({
    id: serialNumber,
    serialNumber: serialNumber++,
    timePeriod: timePeriodStr,
    problemType: '质量',
    problemQuantity: qualityTotal,
  });

  // 显示HSE行（即使值为0也显示）
  tableData.push({
    id: serialNumber,
    serialNumber: serialNumber++,
    timePeriod: timePeriodStr,
    problemType: 'HSE',
    problemQuantity: hseTotal,
  });

  return tableData;
};
