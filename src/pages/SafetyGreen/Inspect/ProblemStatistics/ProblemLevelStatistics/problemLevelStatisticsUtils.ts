
import { SearchParams, ApiParams, ApiDataItem, DefaultChartData, BranchChartData, BranchStatistics, LevelStats, DefaultTableData, BranchTableData } from './types';
import { getDefaultTimePeriod, buildTimeParams } from '../problemStatisticsUtils';
import { SEVERITY_LEVEL_TO_PROP, LEVEL_DISPLAY_NAMES } from './constants';

/**
 * 判断是否未检索（除了时间范围，其他筛选条件都为空）
 * @param params 搜索参数
 * @returns 是否未检索
 */
export const isNoSearch = (params: SearchParams): boolean => {
  return !params.problemSource &&
    !params.examineUnit &&
    !params.problemType &&
    !params.severityLevel &&
    !params.branchCompCode;
};

/**
 * 判断是否按分公司统计（选择了问题类型时显示分公司分布图表）
 * @param params 搜索参数
 * @returns 是否按分公司统计
 */
export const isBranchStatistics = (params: SearchParams): boolean => {
  return params.problemType !== undefined &&
    (params.problemType === '0' || params.problemType === '1');
};

/**
 * 初始化级别统计对象
 * @returns 初始化的级别统计对象
 */
const createInitialLevelStats = (): LevelStats => ({
  minor: 0,
  general: 0,
  major: 0,
  serious: 0,
});

/**
 * 根据severity_level累加对应的级别统计
 * @param levels 级别统计对象
 * @param severityLevel 严重程度级别 (0:严重, 1:较大, 2:一般, 3:轻微)
 * @param itemNum 数量
 */
const accumulateLevelStats = (levels: LevelStats, severityLevel: number, itemNum: number): void => {
  const prop = SEVERITY_LEVEL_TO_PROP[severityLevel];
  prop && (levels[prop] += itemNum);
};

/**
 * 处理接口返回的数据，按照problem_type和severityLevel分组统计
 * @param result 接口返回的数据数组
 * @returns 处理后的图表数据
 */
export const processChartData = (result: ApiDataItem[]): DefaultChartData => {
  const isValidResult = Array.isArray(result) && result.length > 0;

  const levelStats: Record<number, { quality: number; hse: number }> = {
    0: { quality: 0, hse: 0 }, // 严重
    1: { quality: 0, hse: 0 }, // 较大
    2: { quality: 0, hse: 0 }, // 一般
    3: { quality: 0, hse: 0 }, // 轻微
  };

  isValidResult && result.forEach((item: ApiDataItem) => {
    const problemType = Number(item.problem_type); // 0:质量, 1:HSE
    const severityLevel = Number(item.severity_level); // 0:严重,1:较大,2:一般,3:轻微
    const itemNum = Number(item.item_num) || 0;

    const isValidLevel = !isNaN(severityLevel) && severityLevel >= 0 && severityLevel <= 3;
    const stats = isValidLevel ? levelStats[severityLevel] : null;

    stats && (problemType === 0
      ? stats.quality += itemNum
      : problemType === 1 && (stats.hse += itemNum));
  });

  // 转换为数组，顺序为：轻微(3)、一般(2)、较大(1)、严重(0)
  const qualityData = [
    levelStats[3].quality,
    levelStats[2].quality,
    levelStats[1].quality,
    levelStats[0].quality,
  ];
  const hseData = [
    levelStats[3].hse,
    levelStats[2].hse,
    levelStats[1].hse,
    levelStats[0].hse,
  ];

  return { qualityData, hseData };
};

/**
 * 处理按分公司统计的数据（选择了问题类型，按分公司分组）
 * @param result 接口返回的数据数组
 * @param problemType 问题类型 ('0':质量, '1':HSE)
 * @param severityLevel 问题级别（可选）
 * @returns 处理后的分公司统计数据
 */
export const processBranchStatisticsData = (
  result: ApiDataItem[],
  problemType: string,
  severityLevel?: string
): BranchChartData => {
  const isValidResult = Array.isArray(result) && result.length > 0;

  const branchMap: Record<string, BranchStatistics> = {};
  const targetProblemType = Number(problemType); // 0:质量, 1:HSE
  const targetSeverityLevel = severityLevel !== undefined ? Number(severityLevel) : undefined;

  isValidResult && result.forEach((item: ApiDataItem) => {
    const itemProblemType = Number(item.problem_type);
    const branchName = item?.wbs_name || item?.up_wbs_name || '';
    const itemNum = Number(item.item_num) || 0;
    const itemSeverityLevel = Number(item.severity_level);

    // 统计指定问题类型（质量或HSE）
    const isTargetType = itemProblemType === targetProblemType && branchName;
    const isTargetLevel = targetSeverityLevel === undefined || itemSeverityLevel === targetSeverityLevel;

    isTargetType && isTargetLevel && (() => {
      branchMap[branchName] = branchMap[branchName] || {
        total: 0,
        levels: createInitialLevelStats(),
      };

      branchMap[branchName].total += itemNum;
      accumulateLevelStats(branchMap[branchName].levels, itemSeverityLevel, itemNum);
    })();
  });

  // 转换为数组，按分公司名称排序
  const branchNames = Object.keys(branchMap).sort();

  // 如果指定了问题级别，totalData只显示该级别的数量；否则显示所有级别的总和
  const totalData = branchNames.map(name => {
    const levelProp = targetSeverityLevel !== undefined
      ? SEVERITY_LEVEL_TO_PROP[targetSeverityLevel]
      : null;
    return levelProp
      ? branchMap[name].levels[levelProp] || 0
      : branchMap[name].total;
  });

  const detailData = branchNames.map(name => branchMap[name].levels);

  return { branchNames, totalData, detailData };
};

/**
 * 处理表格数据 - 分公司统计模式
 * @param result 接口返回的数据数组
 * @param targetProblemType 目标问题类型
 * @param targetSeverityLevel 目标问题级别（可选）
 * @returns 处理后的表格数据
 */
const processBranchTableData = (
  result: ApiDataItem[],
  targetProblemType: number,
  targetSeverityLevel?: number
): BranchTableData[] => {
  const branchMap: Record<string, BranchStatistics> = {};

  result.forEach((item: ApiDataItem) => {
    const itemProblemType = Number(item.problem_type);
    const branchName = item?.wbs_name || item?.up_wbs_name || '';
    const itemNum = Number(item.item_num) || 0;
    const itemSeverityLevel = Number(item.severity_level);

    const isTargetType = itemProblemType === targetProblemType && branchName;
    const isTargetLevel = targetSeverityLevel === undefined || itemSeverityLevel === targetSeverityLevel;

    isTargetType && isTargetLevel && (() => {
      branchMap[branchName] = branchMap[branchName] || {
        total: 0,
        levels: createInitialLevelStats(),
      };

      branchMap[branchName].total += itemNum;
      accumulateLevelStats(branchMap[branchName].levels, itemSeverityLevel, itemNum);
    })();
  });

  const branchNames = Object.keys(branchMap).sort();
  const tableData = branchNames.map((name, index) => ({
    id: index + 1,
    branchCompany: name,
    minor: branchMap[name].levels.minor,
    general: branchMap[name].levels.general,
    major: branchMap[name].levels.major,
    serious: branchMap[name].levels.serious,
    total: branchMap[name].total,
  }));

  // 计算合计
  const total = {
    id: tableData.length + 1,
    branchCompany: '合计',
    minor: tableData.reduce((sum, item) => sum + item.minor, 0),
    general: tableData.reduce((sum, item) => sum + item.general, 0),
    major: tableData.reduce((sum, item) => sum + item.major, 0),
    serious: tableData.reduce((sum, item) => sum + item.serious, 0),
    total: tableData.reduce((sum, item) => sum + item.total, 0),
  };

  return [...tableData, total];
};

/**
 * 处理表格数据 - 默认模式（按级别分布）
 * @param result 接口返回的数据数组
 * @returns 处理后的表格数据
 */
const processDefaultTableData = (result: ApiDataItem[]): DefaultTableData[] => {
  const levelStats: Record<number, { quality: number; hse: number }> = {
    0: { quality: 0, hse: 0 },
    1: { quality: 0, hse: 0 },
    2: { quality: 0, hse: 0 },
    3: { quality: 0, hse: 0 },
  };

  result.forEach((item: ApiDataItem) => {
    const problemType = Number(item.problem_type);
    const severityLevel = Number(item.severity_level);
    const itemNum = Number(item.item_num) || 0;

    const isValidLevel = !isNaN(severityLevel) && severityLevel >= 0 && severityLevel <= 3;
    const stats = isValidLevel ? levelStats[severityLevel] : null;

    stats && (problemType === 0
      ? stats.quality += itemNum
      : problemType === 1 && (stats.hse += itemNum));
  });

  // 转换为表格数据，顺序为：轻微(3)、一般(2)、较大(1)、严重(0)
  return LEVEL_DISPLAY_NAMES.map((name, index) => {
    const level = 3 - index; // 轻微=3, 一般=2, 较大=1, 严重=0
    return {
      id: index + 1,
      level: name,
      quality: levelStats[level].quality,
      hse: levelStats[level].hse,
    };
  });
};

/**
 * 处理表格数据
 * @param result 接口返回的数据数组
 * @param currentParams 当前搜索参数
 * @returns 处理后的表格数据
 */
export const processTableData = (
  result: ApiDataItem[],
  currentParams: SearchParams
): (DefaultTableData | BranchTableData)[] => {
  const isValidResult = Array.isArray(result) && result.length > 0;
  const branchStatistics = isBranchStatistics(currentParams);

  const shouldUseBranchMode = isValidResult && branchStatistics;

  return shouldUseBranchMode
    ? processBranchTableData(
      result,
      Number(currentParams.problemType),
      currentParams.severityLevel !== undefined ? Number(currentParams.severityLevel) : undefined
    )
    : isValidResult
      ? processDefaultTableData(result)
      : [];
};

/**
 * 构建接口参数
 * @param currentParams 当前搜索参数
 * @returns API参数对象
 */
export const buildApiParams = (currentParams: SearchParams): ApiParams => {
  const params: ApiParams = {};

  // 问题来源
  currentParams.problemSource && (params.problemObsCode = currentParams.problemSource);

  // 检查单位
  currentParams.examineUnit && (params.examineWbsCode = currentParams.examineUnit);

  // 问题类型 (0:质量, 1:hse)
  currentParams.problemType !== undefined && (params.problemType = currentParams.problemType);

  // 问题级别 (0:严重问题,1:较大问题,2:一般问题,3:轻微问题)
  currentParams.severityLevel !== undefined && (params.severityLevel = currentParams.severityLevel);

  // 分公司
  currentParams.branchCompCode && (params.branchCompCode = currentParams.branchCompCode);

  // 项目部
  currentParams.selectWbsCode && (params.selectWbsCode = currentParams.selectWbsCode);

  // 时间戳转换
  Object.assign(params, buildTimeParams(currentParams.timePeriod));

  return params;
};

/**
 * 获取默认搜索参数
 * @returns 默认搜索参数
 */
export const getDefaultSearchParams = (): SearchParams => ({
  timePeriod: getDefaultTimePeriod(),
  problemSource: undefined,
  examineUnit: undefined,
  problemType: undefined,
  severityLevel: undefined,
  branchCompCode: undefined,
  selectWbsCode: undefined,
});

