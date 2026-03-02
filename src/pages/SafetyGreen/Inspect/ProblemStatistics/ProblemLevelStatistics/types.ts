import moment from 'moment';

/**
 * 搜索参数类型定义
 */
export interface SearchParams {
  /** 时间周期范围 [开始时间, 结束时间] */
  timePeriod: [moment.Moment, moment.Moment] | undefined;
  /** 问题来源 */
  problemSource: string | undefined;
  /** 检查单位 */
  examineUnit: string | undefined;
  /** 问题类型 */
  problemType: string | undefined;
  /** 严重程度级别 */
  severityLevel: string | undefined;
  /** 分公司代码 */
  branchCompCode: string | undefined;
  /** 选中的WBS代码 */
  selectWbsCode: string | undefined;
}

/**
 * 问题级别统计数据类型
 * minor: 轻微 (severity_level: 3)
 * general: 一般 (severity_level: 2)
 * major: 较大 (severity_level: 1)
 * serious: 严重 (severity_level: 0)
 */
export interface LevelStats {
  minor: number;
  general: number;
  major: number;
  serious: number;
}

/**
 * 分公司统计数据
 */
export interface BranchStatistics {
  /** 问题总数 */
  total: number;
  /** 各级别统计数据 */
  levels: LevelStats;
}

/**
 * 图表数据 - 默认模式（按级别分布）
 */
export interface DefaultChartData {
  /** 质量问题数据数组 [轻微, 一般, 较大, 严重] */
  qualityData: number[];
  /** HSE问题数据数组 [轻微, 一般, 较大, 严重] */
  hseData: number[];
}

/**
 * 图表数据 - 分公司统计模式
 */
export interface BranchChartData {
  /** 分公司名称数组 */
  branchNames: string[];
  /** 各分公司问题总数数组 */
  totalData: number[];
  /** 各分公司各级别详细统计数据数组 */
  detailData: LevelStats[];
}

/**
 * 图表数据类型（联合类型）
 * 可以是默认模式（按级别分布）或分公司统计模式
 */
export type ChartData = DefaultChartData | BranchChartData;

/**
 * 表格数据 - 默认模式
 */
export interface DefaultTableData {
  /** 行ID */
  id: number;
  /** 问题级别（轻微/一般/较大/严重） */
  level: string;
  /** 质量问题数量 */
  quality: number;
  /** HSE问题数量 */
  hse: number;
}

/**
 * 表格数据 - 分公司统计模式
 */
export interface BranchTableData {
  /** 行ID */
  id: number;
  /** 分公司名称 */
  branchCompany: string;
  /** 轻微问题数量 */
  minor: number;
  /** 一般问题数量 */
  general: number;
  /** 较大问题数量 */
  major: number;
  /** 严重问题数量 */
  serious: number;
  /** 问题总数 */
  total: number;
}

/**
 * 表格数据类型（联合类型）
 * 可以是默认模式（按级别分布）或分公司统计模式
 */
export type TableData = DefaultTableData | BranchTableData;

/**
 * API参数类型
 */
export interface ApiParams {
  /** 问题观察代码 */
  problemObsCode?: string;
  /** 检查WBS代码 */
  examineWbsCode?: string;
  /** 问题类型 */
  problemType?: string;
  /** 严重程度级别 */
  severityLevel?: string;
  /** 分公司代码 */
  branchCompCode?: string;
  /** 选中的WBS代码 */
  selectWbsCode?: string;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
  /** 排序方式 */
  sort?: string;
}

/**
 * 接口返回数据项类型
 */
export interface ApiDataItem {
  /** 问题类型 */
  problem_type: string | number;
  /** 严重程度级别 */
  severity_level: string | number;
  /** 问题数量 */
  item_num: string | number;
  /** 上级WBS名称 */
  up_wbs_name?: string;
  /** WBS名称 */
  wbs_name?: string;
}

