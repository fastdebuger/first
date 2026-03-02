import { buildTimeParams } from '../problemStatisticsUtils';

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
 * 问题归类标签映射配置
 */
const CATEGORY_LABEL_MAP: Record<string, string> = {
  '0': '质量管理类',
  '1': '质量实体类',
  '2': '作业行为类',
  '3': '安全管理类',
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

  // 分公司参数
  if (searchParams.branchCompCode) {
    params.branchCompCode = searchParams.branchCompCode;
  }

  // 项目部参数
  if (searchParams.selectDepCode) {
    params.selectDepCode = searchParams.selectDepCode;
  }

  // 合并时间参数
  Object.assign(params, buildTimeParams(searchParams.timePeriod));
  return params;
};

/**
 * 根据问题归类获取对应的字段名
 * @param problemCategory 问题归类：0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
 * @returns 对应的字段名，如果不存在则返回 null
 */
const getCategoryField = (problemCategory: string | undefined): string | null => {
  if (!problemCategory) {
    return null;
  }
  return CATEGORY_FIELD_MAP[problemCategory] || null;
};

/**
 * 根据问题归类获取对应的标签名
 * @param problemCategory 问题归类：0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
 * @returns 对应的标签名
 */
export const getCategoryLabel = (problemCategory: string | undefined): string => {
  if (!problemCategory) {
    return '问题数量';
  }
  return CATEGORY_LABEL_MAP[problemCategory] || '问题数量';
};

/**
 * 获取数据项的分组键（优先使用wbs_name，不存在则使用up_wbs_name）
 * @param item 数据项
 * @returns 分组键
 */
const getGroupKey = (item: any): string => {
  return item?.wbs_name || item?.up_wbs_name || '';
};

/**
 * 判断问题类型是否为数字0
 * @param problemType 问题类型
 * @returns 是否为数字0
 */
const isZeroNumber = (problemType: any): boolean => {
  return problemType === 0;
};

/**
 * 判断问题类型是否为字符串'0'
 * @param problemType 问题类型
 * @returns 是否为字符串'0'
 */
const isZeroString = (problemType: any): boolean => {
  return problemType === '0';
};

/**
 * 判断问题类型是否为质量问题
 * @param problemType 问题类型
 * @returns 是否为质量问题
 */
const isQualityType = (problemType: any): boolean => {
  // 检查是否为数字0
  if (isZeroNumber(problemType)) {
    return true;
  }
  // 检查是否为字符串'0'或'质量'
  return isZeroString(problemType) || problemType === '质量';
};

/**
 * 判断问题类型是否为数字1
 * @param problemType 问题类型
 * @returns 是否为数字1
 */
const isOneNumber = (problemType: any): boolean => {
  return problemType === 1;
};

/**
 * 判断问题类型是否为字符串'1'
 * @param problemType 问题类型
 * @returns 是否为字符串'1'
 */
const isOneString = (problemType: any): boolean => {
  return problemType === '1';
};

/**
 * 判断问题类型是否为HSE字符串（不区分大小写）
 * @param problemType 问题类型
 * @returns 是否为HSE字符串
 */
const isHseString = (problemType: any): boolean => {
  return problemType === 'HSE' || problemType === 'hse';
};

/**
 * 判断问题类型是否为HSE问题
 * @param problemType 问题类型
 * @returns 是否为HSE问题
 */
const isHseType = (problemType: any): boolean => {
  // 检查是否为数字1
  if (isOneNumber(problemType)) {
    return true;
  }
  // 检查是否为字符串'1'或HSE相关字符串
  return isOneString(problemType) || isHseString(problemType);
};

/**
 * 生成单个问题归类的图表数据（选择了问题归类时使用）
 * @param data 原始数据数组
 * @param categoryField 问题归类对应的字段名
 * @param problemCategory 问题归类值
 * @returns 图表数据对象
 */
const generateCategoryChartData = (
  data: any[],
  categoryField: string,
  problemCategory: string | undefined
) => {
  // 按分组键统计数量
  const branchMap = new Map<string, number>();

  data.forEach((item: any) => {
    const groupKey = getGroupKey(item);
    // 跳过没有分组键的数据
    if (!groupKey) {
      return;
    }

    // 获取当前分组的值，如果没有则初始化为0
    const currentValue = branchMap.get(groupKey) || 0;
    // 累加当前数据项的对应字段值
    const itemValue = Number(item?.[categoryField]) || 0;
    branchMap.set(groupKey, currentValue + itemValue);
  });

  // 转换为排序后的数组
  const sortedBranches = Array.from(branchMap.keys()).sort();
  const categoryData = sortedBranches.map(branch => branchMap.get(branch) || 0);

  // 只要接口返回了数据（有分支名称），就认为有数据，即使值都是0也要显示
  return {
    branchNames: sortedBranches,
    categoryData,
    categoryLabel: getCategoryLabel(problemCategory),
    hasCategoryData: sortedBranches.length > 0,
    qualityData: [],
    hseData: [],
    hasQualityData: false,
    hasHseData: false,
  };
};

/**
 * 生成质量和HSE两个系列的图表数据（未选择问题归类时使用）
 * @param data 原始数据数组
 * @param problemCategory 问题归类值（用于生成标签）
 * @returns 图表数据对象
 */
const generateQualityHseChartData = (data: any[], problemCategory: string | undefined) => {
  // 分别统计质量和HSE的数量
  const qualityMap = new Map<string, number>();
  const hseMap = new Map<string, number>();

  data.forEach((item: any) => {
    const groupKey = getGroupKey(item);
    // 跳过没有分组键的数据
    if (!groupKey) {
      return;
    }

    // 初始化当前分组的值
    if (!qualityMap.has(groupKey)) {
      qualityMap.set(groupKey, 0);
    }
    if (!hseMap.has(groupKey)) {
      hseMap.set(groupKey, 0);
    }

    const problemType = item?.problem_type;
    const isQuality = isQualityType(problemType);
    const isHse = isHseType(problemType);

    // 根据问题类型累加对应的数据
    if (isQuality) {
      // 质量问题：累加质量总数
      const currentQuality = qualityMap.get(groupKey) || 0;
      const qualityValue = Number(item?.quality_all_num) || 0;
      qualityMap.set(groupKey, currentQuality + qualityValue);
    } else if (isHse) {
      // HSE问题：累加HSE总数
      const currentHse = hseMap.get(groupKey) || 0;
      const hseValue = Number(item?.safety_all_num) || 0;
      hseMap.set(groupKey, currentHse + hseValue);
    } else {
      // 问题类型不明确：同时累加质量和HSE数据（兼容处理）
      const currentQuality = qualityMap.get(groupKey) || 0;
      const currentHse = hseMap.get(groupKey) || 0;
      const qualityValue = Number(item?.quality_all_num) || 0;
      const hseValue = Number(item?.safety_all_num) || 0;
      qualityMap.set(groupKey, currentQuality + qualityValue);
      hseMap.set(groupKey, currentHse + hseValue);
    }
  });

  // 获取所有分支名称（合并质量和HSE的keys）
  const allBranches = new Set([...qualityMap.keys(), ...hseMap.keys()]);
  const sortedBranches = Array.from(allBranches).sort();

  // 生成对应的数据数组
  const qualityData = sortedBranches.map(branch => qualityMap.get(branch) || 0);
  const hseData = sortedBranches.map(branch => hseMap.get(branch) || 0);

  // 只要接口返回了数据（有分支名称），就认为有数据，即使值都是0也要显示
  // 这里判断是否有分支名称，而不是数据值是否>0
  const hasBranches = sortedBranches.length > 0;

  return {
    branchNames: sortedBranches,
    categoryData: [],
    categoryLabel: getCategoryLabel(problemCategory),
    hasCategoryData: false,
    qualityData,
    hseData,
    hasQualityData: hasBranches, // 只要有分支就显示质量系列，即使值都是0
    hasHseData: hasBranches, // 只要有分支就显示HSE系列，即使值都是0
  };
};

/**
 * 生成空图表数据（数据为空时返回）
 * @param problemCategory 问题归类值
 * @returns 空图表数据对象
 */
const generateEmptyChartData = (problemCategory: string | undefined) => {
  return {
    branchNames: [],
    categoryData: [],
    categoryLabel: getCategoryLabel(problemCategory),
    qualityData: [],
    hseData: [],
    hasQualityData: false,
    hasHseData: false,
  };
};

/**
 * 生成图表数据
 * @param data 原始数据数组
 * @param problemCategory 问题归类：0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
 * @returns 图表数据对象
 */
export const generateChartData = (data: any[], problemCategory?: string | undefined) => {
  // 数据为空时返回空数据
  if (!data || !Array.isArray(data)) {
    return generateEmptyChartData(problemCategory);
  }

  // 获取问题归类对应的字段名
  const categoryField = getCategoryField(problemCategory);

  // 如果选择了问题归类，生成单个系列的图表数据
  if (categoryField) {
    return generateCategoryChartData(data, categoryField, problemCategory);
  }

  // 如果没有选择问题归类，生成质量和HSE两个系列的图表数据
  return generateQualityHseChartData(data, problemCategory);
};
