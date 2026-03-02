/**
 * 图表配置
 */

/**
 * 图表基础配置
 */
const BASE_CHART_CONFIG = {
  title: {
    text: '各分公司、项目部问题统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    top: 30,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    name: '分公司',
    axisLabel: {
      interval: 0, // 显示所有标签
    },
  },
  yAxis: {
    type: 'value',
    name: '问题数量',
  },
};

/**
 * 生成单个问题归类的图表配置（选择了问题归类时使用）
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
const generateCategoryChartOption = (chartData: any) => {
  // 根据分支数量决定是否旋转标签
  const shouldRotate = chartData?.branchNames?.length > 5;

  return {
    ...BASE_CHART_CONFIG,
    tooltip: {
      ...BASE_CHART_CONFIG.tooltip,
      formatter: (params: any) => {
        // 处理tooltip显示格式
        const param = Array.isArray(params) ? params[0] : params;
        return `${param.name}<br/>${chartData.categoryLabel}: ${param.value}`;
      },
    },
    legend: {
      ...BASE_CHART_CONFIG.legend,
      data: [chartData.categoryLabel],
    },
    xAxis: {
      ...BASE_CHART_CONFIG.xAxis,
      data: chartData?.branchNames || [],
      axisLabel: {
        ...BASE_CHART_CONFIG.xAxis.axisLabel,
        rotate: shouldRotate ? 45 : 0,
      },
    },
    series: [
      {
        name: chartData.categoryLabel,
        type: 'bar',
        data: chartData.categoryData,
        itemStyle: {
          color: '#5470c6',
        },
      },
    ],
  };
};

/**
 * 检查是否有分支名称数据
 * @param chartData 图表数据
 * @returns 是否有分支名称
 */
const hasBranchNames = (chartData: any): boolean => {
  const branchNames = chartData?.branchNames;
  return Boolean(branchNames) && branchNames.length > 0;
};

/**
 * 生成质量和HSE两个系列的图表配置（未选择问题归类时使用）
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
const generateQualityHseChartOption = (chartData: any) => {
  // 根据分支数量决定是否旋转标签
  const branchNames = chartData?.branchNames;
  const branchCount = branchNames?.length || 0;
  const shouldRotate = branchCount > 5;

  // 根据实际数据动态生成 legend 和 series
  // 只要接口返回了数据（有分支名称），就显示质量和HSE两个系列，即使数据值都是0
  const legendData: string[] = [];
  const series: any[] = [];

  // 检查是否有分支名称
  const hasBranches = hasBranchNames(chartData);
  // 检查是否有质量数据标志
  const hasQualityFlag = Boolean(chartData?.hasQualityData);

  // 只要有分支名称，就添加质量系列（即使值都是0也要显示）
  if (hasQualityFlag && hasBranches) {
    legendData.push('质量问题');
    series.push({
      name: '质量问题',
      type: 'bar',
      data: chartData?.qualityData || [],
      itemStyle: {
        color: '#5470c6',
      },
    });
  }

  // 检查是否有HSE数据标志
  const hasHseFlag = Boolean(chartData?.hasHseData);

  // 只要有分支名称，就添加HSE系列（即使值都是0也要显示）
  if (hasHseFlag && hasBranches) {
    legendData.push('HSE问题');
    series.push({
      name: 'HSE问题',
      type: 'bar',
      data: chartData?.hseData || [],
      itemStyle: {
        color: '#91cc75',
      },
    });
  }

  return {
    ...BASE_CHART_CONFIG,
    legend: {
      ...BASE_CHART_CONFIG.legend,
      data: legendData,
    },
    xAxis: {
      ...BASE_CHART_CONFIG.xAxis,
      data: chartData?.branchNames || [],
      axisLabel: {
        ...BASE_CHART_CONFIG.xAxis.axisLabel,
        rotate: shouldRotate ? 45 : 0,
      },
    },
    series: series,
  };
};

/**
 * 分公司问题统计柱状图配置
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
export const getBarOption = (chartData: any) => {
  // 检查是否选择了问题归类
  const hasCategoryData = Boolean(chartData?.hasCategoryData);
  // 检查是否有分支名称
  const hasBranches = hasBranchNames(chartData);

  // 如果选择了问题归类且有分支名称，显示单个系列
  // 只要接口返回了数据（有分支名称），就显示图表，即使数据值都是0
  if (hasCategoryData && hasBranches) {
    return generateCategoryChartOption(chartData);
  }

  // 如果没有选择问题归类，显示质量和HSE两个系列
  // 只要接口返回了数据（有分支名称），就显示图表，即使数据值都是0
  return generateQualityHseChartOption(chartData);
};
