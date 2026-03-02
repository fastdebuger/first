/**
 * 图表配置工具函数
 * 用于生成作业行为统计分析的图表配置
 */

/**
 * 图表数据类型
 */
export interface ChartData {
  // 柱状图数据
  projectNames?: string[];
  totalNums?: number[];
  projectListData?: Array<{ wbsCode: string; wbsName: string; totalNum: number }>;
  // 折线图数据
  dictNames?: string[];
  itemNums?: number[];
}

/**
 * 图表配置参数
 */
export interface ChartOptionParams {
  chartData: ChartData | null;
  isComp: boolean; // 是否公司层级
  isSubComp: boolean; // 是否分公司层级
  selectedProject: { wbsCode: string; wbsName: string } | null; // 选中的项目部
  selectedBranchComp: { wbsCode: string; wbsName: string } | null; // 选中的分公司
}

/**
 * 获取柱状图标题
 * @param isComp 是否公司层级
 * @param isSubComp 是否分公司层级
 * @param selectedBranchComp 选中的分公司
 * @returns 标题文本
 */
const getBarChartTitle = (
  isComp: boolean,
  isSubComp: boolean,
  selectedBranchComp: { wbsCode: string; wbsName: string } | null
): string => {
  // 公司层级
  if (isComp) {
    // 如果选中了分公司，显示分公司名称
    if (selectedBranchComp) {
      return `${selectedBranchComp.wbsName} - 各项目部问题总数统计`;
    }
    // 否则显示所有分公司
    return '各分公司问题总数统计';
  }
  // 分公司层级：显示所有项目部
  return '各项目部问题总数统计';
};

/**
 * 生成柱状图配置
 * @param chartData 图表数据
 * @param params 配置参数
 * @returns echarts 柱状图配置对象
 */
const getBarChartOption = (chartData: ChartData, params: ChartOptionParams) => {
  const titleText = getBarChartTitle(params.isComp, params.isSubComp, params.selectedBranchComp);

  return {
    title: { text: titleText, left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const param = params[0];
        return `${param.name}<br/>问题总数: ${param.value}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.projectNames,
      axisLabel: {
        rotate: chartData.projectNames!.length > 6 ? 45 : 0,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '问题总数',
    },
    series: [{
      name: '问题总数',
      type: 'bar',
      data: chartData.totalNums,
      itemStyle: { color: '#1890ff' },
      label: { show: true, position: 'top' },
    }],
  };
};

/**
 * 生成折线图配置
 * @param chartData 图表数据
 * @returns echarts 折线图配置对象
 */
const getLineChartOption = (chartData: ChartData) => {
  return {
    title: { text: '作业行为统计分析', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: { data: ['问题数量'], top: 30 },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.dictNames,
      axisLabel: {
        rotate: chartData.dictNames!.length > 6 ? 45 : 0,
      },
    },
    yAxis: { type: 'value' },
    series: [{
      name: '问题数量',
      type: 'line',
      data: chartData.itemNums,
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
          ],
        },
      },
      lineStyle: { color: '#1890ff' },
      itemStyle: { color: '#1890ff' },
    }],
  };
};

/**
 * 生成空图表配置（无数据时使用）
 * @returns echarts 空配置对象
 */
const getEmptyChartOption = () => {
  return {
    title: { text: '作业行为统计分析', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{
      name: '问题数量',
      type: 'line',
      data: [],
      smooth: true,
      areaStyle: {},
    }],
  };
};

/**
 * 生成图表配置
 * @param params 配置参数
 * @returns echarts 配置对象
 */
export const getChartOption = (params: ChartOptionParams) => {
  const { chartData, isComp, isSubComp, selectedProject } = params;

  /**
   * 判断是否显示柱状图
   * 条件：公司/分公司层级 且 未选中项目部 且 有柱状图数据
   */
  const isBarChartData = chartData?.projectNames && chartData.projectNames.length > 0;
  const showBarChart = (isComp || isSubComp) && !selectedProject && isBarChartData;

  // 显示柱状图
  if (showBarChart && chartData) {
    return getBarChartOption(chartData, params);
  }

  // 折线图数据校验
  if (!chartData || !chartData.dictNames || chartData.dictNames.length === 0) {
    // 返回空图表配置
    return getEmptyChartOption();
  }

  // 返回完整的折线图配置
  return getLineChartOption(chartData);
};

