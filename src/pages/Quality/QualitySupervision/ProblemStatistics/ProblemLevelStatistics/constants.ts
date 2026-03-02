/**
 * 问题级别常量映射
 * 级别值 -> 级别名称
 */
export const SEVERITY_LEVEL_NAMES: Record<string, string> = {
  '0': '严重问题',
  '1': '较大问题',
  '2': '一般问题',
  '3': '轻微问题',
};

/**
 * 问题级别显示名称数组（按显示顺序）
 */
export const LEVEL_DISPLAY_NAMES = ['轻微', '一般', '较大', '严重'] as const;

/**
 * 问题类型映射
 */
export const PROBLEM_TYPE_MAP = {
  QUALITY: '0',
  HSE: '1',
} as const;

/**
 * 问题类型名称映射
 */
export const PROBLEM_TYPE_NAMES: Record<string, string> = {
  '0': '质量',
  '1': 'HSE',
};

/**
 * 问题类型颜色映射
 */
export const PROBLEM_TYPE_COLORS: Record<string, string> = {
  '0': '#5470c6',
  '1': '#91cc75',
};

/**
 * 级别值到属性名的映射
 * severity_level -> LevelStats属性名
 */
export const SEVERITY_LEVEL_TO_PROP: Record<number, keyof import('./types').LevelStats> = {
  3: 'minor',
  2: 'general',
  1: 'major',
  0: 'serious',
};

/**
 * 默认图表数据
 */
export const DEFAULT_CHART_DATA = {
  qualityData: [0, 0, 0, 0],
  hseData: [0, 0, 0, 0],
};

/**
 * 图表配置常量
 */
export const CHART_CONFIG = {
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxisLabelRotateThreshold: 5, // 分公司数量超过此值时旋转标签
} as const;

