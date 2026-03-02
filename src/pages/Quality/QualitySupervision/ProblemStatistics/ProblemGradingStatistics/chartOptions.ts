/**
 * 图表配置
 */

/**
 * 饼状图配置 - 问题级别分布
 */
export const getPieOption = (pieData: any[]) => ({
  title: {
    text: '问题级别分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '问题级别',
      type: 'pie',
      radius: '50%',
      data: pieData || [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

/**
 * 饼状图配置 - 关闭/未关闭分布
 */
export const getCloseStatusPieOption = (pieData: any[]) => ({
  title: {
    text: '关闭/未关闭分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '关闭状态',
      type: 'pie',
      radius: '50%',
      data: pieData || [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

/**
 * 分公司柱状图配置
 */
export const getBranchCompanyBarOption = (chartData: any) => ({
  title: {
    text: '分公司问题统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['质量问题', 'HSE问题'],
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
    data: chartData?.branchChart?.branches || [],
    axisLabel: {
      rotate: 45,
      interval: 0,
    },
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '质量问题',
      type: 'bar',
      data: chartData?.branchChart?.quality || [],
    },
    {
      name: 'HSE问题',
      type: 'bar',
      data: chartData?.branchChart?.hse || [],
    },
  ],
});

/**
 * 柱状图配置
 */
export const getBarOption = (chartData: any) => ({
  title: {
    text: '质量问题和HSE问题对比',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['质量问题', 'HSE问题'],
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
    data: ['轻微问题', '一般问题', '较大问题', '严重问题'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '质量问题',
      type: 'bar',
      data: chartData?.barData ? [
        chartData.barData.quality?.minor,
        chartData.barData.quality?.general,
        chartData.barData.quality?.major,
        chartData.barData.quality?.serious,
      ] : [],
    },
    {
      name: 'HSE问题',
      type: 'bar',
      data: chartData?.barData ? [
        chartData.barData.hse?.minor,
        chartData.barData.hse?.general,
        chartData.barData.hse?.major,
        chartData.barData.hse?.serious,
      ] : [],
    },
  ],
});

