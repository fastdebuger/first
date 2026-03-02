/**
 * 图表配置
 */

/**
 * 图表基础配置
 */
const BASE_CHART_CONFIG = {
  title: {
    text: '问题类别统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    name: '问题类别',
    axisLabel: {
      interval: 0, // 显示所有标签
      rotate: 45, // 旋转45度，避免标签重叠
    },
  },
  yAxis: {
    type: 'value',
    name: '问题数量',
  },
};

/**
 * 问题类别统计柱状图配置
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
export const getBarOption = (chartData: any) => {
  // 检查是否有数据
  const hasData = Boolean(chartData && chartData.categoryNames && chartData.categoryNames.length > 0);

  // 如果没有数据，返回空配置
  if (!hasData) {
    return {
      ...BASE_CHART_CONFIG,
      xAxis: {
        ...BASE_CHART_CONFIG.xAxis,
        data: [],
      },
      series: [],
    };
  }

  const categoryNames = chartData.categoryNames || [];
  const itemNums = chartData.itemNums || [];

  return {
    ...BASE_CHART_CONFIG,
    xAxis: {
      ...BASE_CHART_CONFIG.xAxis,
      data: categoryNames,
    },
    series: [
      {
        type: 'bar',
        name: '问题数量',
        data: itemNums,
        itemStyle: {
          color: '#5470c6',
        },
      },
    ],
  };
};

