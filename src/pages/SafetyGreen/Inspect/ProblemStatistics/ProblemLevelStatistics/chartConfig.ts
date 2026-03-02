import { ChartData, SearchParams } from './types';
import { SEVERITY_LEVEL_NAMES, PROBLEM_TYPE_NAMES, PROBLEM_TYPE_COLORS, CHART_CONFIG, LEVEL_DISPLAY_NAMES } from './constants';

/**
 * 生成分公司统计模式的图表配置
 * @param chartData 图表数据
 * @param queryParams 查询参数
 * @returns ECharts配置对象
 */
const generateBranchChartOption = (chartData: any, queryParams: SearchParams) => {
  const branchNames = chartData.branchNames || [];
  const totalData = chartData.totalData || [];
  const detailData = chartData.detailData || [];
  // 确保 problemType 有值，如果没有则使用默认值
  const problemType = queryParams.problemType;
  const problemTypeName = problemType ? (PROBLEM_TYPE_NAMES[problemType] || 'HSE') : 'HSE';
  const problemTypeColor = problemType ? (PROBLEM_TYPE_COLORS[problemType] || '#91cc75') : '#91cc75';

  // 判断是否指定了问题级别
  const severityLevelName = queryParams.severityLevel
    ? SEVERITY_LEVEL_NAMES[queryParams.severityLevel]
    : '';
  const chartTitle = severityLevelName
    ? `${problemTypeName} - ${severityLevelName}在各分公司分布`
    : `${problemTypeName}问题在各分公司分布`;

  return {
    title: {
      text: chartTitle,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const index = params.dataIndex;
        const detail = detailData[index];
        const currentSeverityLevelName = queryParams.severityLevel
          ? SEVERITY_LEVEL_NAMES[queryParams.severityLevel]
          : '';

        const hasDetail = Boolean(detail);
        const hasSeverityLevel = Boolean(queryParams.severityLevel && currentSeverityLevelName);

        // 如果指定了问题级别，只显示该级别的数量；否则显示总数和四个级别的详细数据
        return hasDetail && hasSeverityLevel
          ? `
            <div style="padding: 5px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
              <div>${currentSeverityLevelName}: ${params.value}</div>
            </div>
          `
          : hasDetail
          ? `
            <div style="padding: 5px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
              <div>总数: ${params.value}</div>
              <div style="margin-top: 5px; border-top: 1px solid #eee; padding-top: 5px;">
                <div>轻微: ${detail.minor}</div>
                <div>一般: ${detail.general}</div>
                <div>较大: ${detail.major}</div>
                <div>严重: ${detail.serious}</div>
              </div>
            </div>
          `
          : `${params.name}<br/>数量: ${params.value}`;
      },
    },
    grid: CHART_CONFIG.grid,
    xAxis: {
      type: 'category',
      data: branchNames,
      name: '分公司',
      axisLabel: {
        rotate: branchNames.length > CHART_CONFIG.xAxisLabelRotateThreshold ? 45 : 0,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '问题数量',
    },
    series: [
      {
        name: `${problemTypeName}问题总数`,
        type: 'bar',
        data: totalData,
        itemStyle: {
          color: problemTypeColor,
        },
      },
    ],
  };
};

/**
 * 生成默认模式的图表配置（按问题级别分布）
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
const generateDefaultChartOption = (chartData: any) => {
  const levelData = [...LEVEL_DISPLAY_NAMES];
  const qualityData = chartData.qualityData || [0, 0, 0, 0];
  const hseData = chartData.hseData || [0, 0, 0, 0];

  return {
    title: {
      text: '问题级别分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        let result = params[0].name + '<br/>';
        params.forEach((item: any) => {
          result += item.marker + item.seriesName + ': ' + item.value + '<br/>';
        });
        return result;
      },
    },
    legend: {
      data: ['质量问题', 'HSE问题'],
      top: 30,
    },
    grid: CHART_CONFIG.grid,
    xAxis: {
      type: 'category',
      data: levelData,
      name: '问题级别',
    },
    yAxis: {
      type: 'value',
      name: '问题数量',
    },
    series: [
      {
        name: '质量问题',
        type: 'bar',
        data: qualityData,
      },
      {
        name: 'HSE问题',
        type: 'bar',
        data: hseData,
      },
    ],
  };
};

/**
 * 生成图表配置
 * @param chartData 图表数据
 * @param queryParams 查询参数
 * @returns ECharts配置对象
 */
export const getChartOption = (chartData: ChartData, queryParams: SearchParams) => {
  const branchStatistics = queryParams.problemType !== undefined &&
                           (queryParams.problemType === '0' || queryParams.problemType === '1');

  // 检查是否有分公司数据结构（只要 branchNames 属性存在，即使为空数组也认为是分公司模式）
  const hasBranchDataStructure = chartData && 'branchNames' in chartData;
  const shouldUseBranchMode = branchStatistics && hasBranchDataStructure;

  return shouldUseBranchMode
    ? generateBranchChartOption(chartData, queryParams)
    : generateDefaultChartOption(chartData);
};

