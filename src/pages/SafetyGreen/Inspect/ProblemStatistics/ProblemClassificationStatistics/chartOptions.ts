/**
 * 图表配置
 */

/**
 * 图表基础配置
 */
const BASE_CHART_CONFIG = {
  title: {
    text: '问题归类统计',
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
    name: '问题类型',
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
 * 生成选择了问题归类时的图表配置
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
const generateCategoryChartOption = (chartData: any) => {
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
      data: chartData?.typeNames || [],
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
 * 生成没有选择问题归类时的图表配置（单排柱状图，每个类别一条柱状图）
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
const generateQualityHseChartOption = (chartData: any) => {
  // 单排柱状图，使用不同颜色区分质量和HSE
  const typeNames = chartData?.typeNames || [];
  const singleData = chartData?.singleData || chartData?.categoryData || [];
  const colors = chartData?.singleColors || ['#5470c6', '#91cc75'];

  return {
    ...BASE_CHART_CONFIG,
    legend: {
      show: false, // 单排柱状图不需要图例
    },
    tooltip: {
      ...BASE_CHART_CONFIG.tooltip,
      formatter: (params: any) => {
        const param = Array.isArray(params) ? params[0] : params;
        const typeName = param.name;
        const value = param.value;
        // 根据类别名称判断显示标签
        let label = typeName;
        if (typeName === '质量' || typeName === 'HSE') {
          label = typeName === '质量' ? '质量问题' : 'HSE问题';
        }
        return `${typeName}<br/>${label}: ${value}`;
      },
    },
    xAxis: {
      ...BASE_CHART_CONFIG.xAxis,
      data: typeNames,
    },
    series: [
      {
        type: 'bar',
        data: singleData,
        itemStyle: {
          color: (params: any) => {
            // 根据数据索引返回对应颜色
            return colors[params.dataIndex] || '#5470c6';
          },
        },
      },
    ],
  };
};

/**
 * 问题归类统计柱状图配置
 * @param chartData 图表数据
 * @returns ECharts配置对象
 */
export const getBarOption = (chartData: any) => {
  // 检查是否有数据
  const hasData = Boolean(chartData && Object.keys(chartData).length > 0);

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

  // 检查是否选择了问题归类
  const hasCategoryData = Boolean(chartData?.hasCategoryData);
  // 检查是否有类型名称
  const hasTypeNames = Boolean(chartData?.typeNames && chartData.typeNames.length > 0);

  // 如果选择了问题归类且有类型名称，显示单个系列
  if (hasCategoryData && hasTypeNames) {
    return generateCategoryChartOption(chartData);
  }

  // 如果没有选择问题归类，显示质量和HSE两个系列
  return generateQualityHseChartOption(chartData);
};

