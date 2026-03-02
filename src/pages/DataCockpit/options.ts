import * as echarts from 'echarts';

export const mergedClass = (...args: (string | undefined | boolean)[]) => args.filter(Boolean).join(' ');

// 全局样式变量
const GLOBAL_STYLE = {
  textColor: '#e5eaf3',
  subTextColor: '#06172fff',
  gridBg: 'rgba(255,255,255,0.01)',
  splitLineColor: 'rgba(255,255,255,0.05)',
  borderRadius: 8,
  titleFontSize: 16,
  mainColor: '#00f2ff', // 荧光青
  subMainColor: '#00A3E0', // 科技蓝
  successColor: '#00ffcc', // 极光绿
  warningColor: '#ffbb96', // 琥珀色
  dangerColor: '#ff4d4f', // 警示红

  titleFontWeight: 500 as const,
  axisLabelFontSize: 12,
  legendFontSize: 11,
  infoColor: '#00c4ff' // 浅蓝
};

export const getOptions = (dynamicData?: { safetyHours?: any }) => {

  // 图表5根据用户的配置动态展示
  const {
    activation_type,
    total,
    safety_annual_hour
  } = dynamicData?.safetyHours?.annual || {};
  const displaySafetyHour = String(activation_type === "1") ? total : safety_annual_hour;

  return ({

    // 1. 工程数量
    projectCount: {
      backgroundColor: GLOBAL_STYLE.gridBg,
      title: {
        text: `{t|工程数量}`,
        left: '20',
        top: '15',
        textStyle: {
          rich: {
            t: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
            v: { color: GLOBAL_STYLE.mainColor, fontSize: 14, padding: [0, 0, 0, 10] }
          }
        }
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 242, 255, 0.1)',
            borderRadius: 4
          }
        },
        backgroundColor: 'rgba(10, 18, 32, 0.9)',
        borderRadius: 8,
        padding: [10, 15],
        textStyle: { color: '#fff', fontSize: 12, lineHeight: 1.6 },
        borderColor: 'rgba(0, 242, 255, 0.3)',
        borderWidth: 1,
        formatter: '{b}：{c} 项'
      },
      grid: { top: '30%', left: '5%', right: '5%', bottom: '8%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['总量', 'A级', 'B级', '其他'],
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: { color: GLOBAL_STYLE.subTextColor, margin: 12 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: GLOBAL_STYLE.splitLineColor, type: 'dashed' } },
        axisLabel: { color: GLOBAL_STYLE.subTextColor }
      },
      series: [{
        data: [320, 85, 140, 95],
        type: 'bar',
        barWidth: '26%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: GLOBAL_STYLE.mainColor },
            { offset: 1, color: 'rgba(0, 242, 255, 0)' }
          ]),
          borderRadius: [15, 15, 0, 0],
          shadowBlur: 10,
          shadowColor: 'rgba(0, 242, 255, 0.4)'
        },
        label: { show: true, position: 'top', color: GLOBAL_STYLE.mainColor, fontSize: 11, fontWeight: 'bold' }
      }]
    },

    // 2. 人员结构分析
    staffDistribution: {
      backgroundColor: GLOBAL_STYLE.gridBg,
      title: {
        text: '{a|人员数量}',
        left: '20',
        top: '15',
        textStyle: {
          rich: {
            a: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
          }
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 18, 32, 0.9)',
        borderColor: GLOBAL_STYLE.mainColor,
        borderWidth: 1,
        formatter: '{b}<br/>人数：<span style="color:#fff;font-weight:bold">{c}</span>人<br/>占比：<span style="color:#fff;font-weight:bold">{d}%</span>'
      },
      series: [
        {
          type: 'pie',
          radius: ['75%', '78%'],
          center: ['50%', '60%'],
          silent: true,
          label: { show: false },
          data: [{ value: 1, itemStyle: { color: 'rgba(255,255,255,0.03)' } }]
        },
        {
          name: '人员构成',
          type: 'pie',
          radius: ['52%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#010812',
            borderWidth: 4
          },
          label: {
            show: true,
            position: 'center',
            // 中心展示总人数，使用更大号的字体和荧光色
            formatter: () => `{val|3502}\n{unit|在岗总人数}`,
            rich: {
              val: { color: GLOBAL_STYLE.mainColor, fontSize: 30, fontWeight: 'bold', lineHeight: 40 },
              unit: { color: GLOBAL_STYLE.subTextColor, fontSize: 13 }
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 242, 255, 0.5)'
            }
          },
          data: [
            {
              value: 2302,
              name: '分包商',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: GLOBAL_STYLE.mainColor },
                  { offset: 1, color: 'rgba(0, 242, 255, 0.3)' }
                ])
              }
            },
            {
              value: 1200,
              name: '自有人员',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: GLOBAL_STYLE.subMainColor },
                  { offset: 1, color: 'rgba(0, 163, 224, 0.3)' }
                ])
              }
            }
          ]
        }
      ]
    },

    // 3. 管道吋口
    pipeProgress: {
      backgroundColor: GLOBAL_STYLE.gridBg,
      borderRadius: GLOBAL_STYLE.borderRadius,
      title: {
        text: "管道吋口",
        left: '15px',
        top: '15px',
        textStyle: {
          color: GLOBAL_STYLE.textColor,
          fontSize: GLOBAL_STYLE.titleFontSize,
          fontWeight: GLOBAL_STYLE.titleFontWeight
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 18, 32, 0.9)',
        borderRadius: 4,
        textStyle: { color: '#fff' },
        axisPointer: {
          type: 'line',
          lineStyle: { color: 'rgba(255,255,255,0.2)' }
        },
        formatter: '{b}<br/>{a}: {c} 吋口'
      },
      legend: {
        right: '15px',
        top: '15px',
        textStyle: { color: GLOBAL_STYLE.subTextColor, fontSize: GLOBAL_STYLE.legendFontSize },
        itemWidth: 12,
        itemHeight: 8,
        itemGap: 15
      },
      grid: { top: '50px', left: '15px', right: '15px', bottom: '15px', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['W1', 'W2', 'W3', 'W4'],
        boundaryGap: false,
        axisLine: { lineStyle: { color: GLOBAL_STYLE.splitLineColor } },
        axisTick: { show: false },
        axisLabel: { color: GLOBAL_STYLE.subTextColor, fontSize: GLOBAL_STYLE.axisLabelFontSize }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: GLOBAL_STYLE.subTextColor, fontSize: GLOBAL_STYLE.axisLabelFontSize },
        splitLine: { lineStyle: { color: GLOBAL_STYLE.splitLineColor } },
        name: '吋口数量',
        nameTextStyle: { color: GLOBAL_STYLE.subTextColor, fontSize: GLOBAL_STYLE.axisLabelFontSize - 1 }
      },
      series: [
        {
          name: '吋口总量',
          data: [800, 800, 800, 800],
          type: 'line',
          step: 'start',
          lineStyle: { color: '#444', type: 'dashed', width: 1 },
          symbol: 'none',
          tooltip: { formatter: '{b}<br/>{a}: {c} 吋口（基准总量）' }
        },
        {
          name: '已完成',
          data: [210, 380, 560, 720],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 163, 224, 0.15)' },
              { offset: 1, color: 'rgba(0, 163, 224, 0.05)' }
            ])
          },
          lineStyle: { color: GLOBAL_STYLE.subMainColor, width: 2 },
          symbol: 'circle',
          symbolSize: 4,
          emphasis: {
            symbolSize: 8,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 163, 224, 0.6)'
          }
        },
        {
          name: '自动焊完成',
          data: [120, 260, 410, 580],
          type: 'line',
          smooth: true,
          lineStyle: { color: GLOBAL_STYLE.successColor, width: 2.5 },
          symbol: 'circle',
          symbolSize: 4,
          emphasis: {
            symbolSize: 8,
            shadowBlur: 10,
            shadowColor: 'rgba(105, 210, 0, 0.6)'
          }
        }
      ]
    },

    // 4. 问题数量
    issueStats: {
      backgroundColor: GLOBAL_STYLE.gridBg,
      title: { text: "问题数量", left: '20', top: '15', textStyle: { color: '#fff', fontSize: 16 } },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 6
          }
        },
        backgroundColor: 'rgba(10, 18, 32, 0.9)',
        borderRadius: 10,
        padding: [10, 15],
        textStyle: { color: '#fff', fontSize: 12, lineHeight: 1.6 },
        borderColor: (params: any) => {
          const colors = [GLOBAL_STYLE.subMainColor, '#36cfc9', '#00c4ff', '#722ed1', GLOBAL_STYLE.dangerColor, GLOBAL_STYLE.mainColor];
          return params.length > 0 ? colors[params[0].dataIndex] : GLOBAL_STYLE.mainColor;
        },
        borderWidth: 2,
        formatter: '{b}问题：{c} 个'
      },
      grid: { top: '20%', left: '5%', right: '12%', bottom: '5%', containLabel: true },
      xAxis: { type: 'value', splitLine: { show: false }, axisLabel: { show: false } },
      yAxis: {
        type: 'category',
        data: ['质量', '安全', '总量', '较大', '严重', '记分'],
        inverse: true,
        axisLine: { show: false },
        axisLabel: { color: (val: any) => val === '严重' ? GLOBAL_STYLE.dangerColor : '#fff' }
      },
      series: [{
        data: [45, 32, 97, 26, 12, 28],
        type: 'bar',
        barWidth: 12,
        itemStyle: {
          borderRadius: 10,
          color: (params: any) => {
            const colors = [GLOBAL_STYLE.subMainColor, '#36cfc9', '#00c4ff', '#722ed1', GLOBAL_STYLE.dangerColor, GLOBAL_STYLE.mainColor];
            return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: colors[params.dataIndex] },
              { offset: 1, color: 'rgba(0,0,0,0.1)' }
            ]);
          }
        },
        label: { show: true, position: 'right', color: '#fff' }
      }]
    },

    // 5. 安全工时
    safetyHours: {
      backgroundColor: GLOBAL_STYLE.gridBg,
      title: {
        text: "安全生产",
        left: '20',
        top: '15',
        textStyle: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
      },
      graphic: [
        {
          type: 'group',
          left: '20',
          top: '60',
          children: [
            {
              type: 'text',
              left: 0,
              top: 0,
              style: {
                text: '连续安全生产',
                fontSize: 14,
                fontWeight: '500',
                fill: '#fff'
              }
            },
            {
              type: 'text',
              left: 0,
              top: 25,
              style: {
                text: dynamicData?.safetyHours?.continuous
                  ? `${dynamicData.safetyHours.continuous.days} 天 ${dynamicData.safetyHours.continuous.hour} 小时`
                  : '— 天',
                fontSize: 14,
                fontWeight: 'bold',
                fill: GLOBAL_STYLE.successColor
              }
            },
            {
              type: 'text',
              left: 0,
              top: 80,
              style: {
                text: '年度安全工时',
                fontSize: 14,
                fontWeight: '500',
                fill: '#fff'
              }
            },
            {
              type: 'text',
              left: 0,
              top: 105,
              style: {
                text: `${displaySafetyHour || 0} 小时`,
                fontSize: 14,
                fontWeight: 'bold',
                fill: GLOBAL_STYLE.mainColor
              }
            }
          ]
        }
      ],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 20, 40, 0.9)',
        borderColor: GLOBAL_STYLE.mainColor,
        borderWidth: 1,
        padding: [12, 18],
        formatter: (params: any) => {
          if (params.name.includes('工时')) {
            const h = params.value;
            const d = (h / 24).toFixed(1);
            return `<b style="color:${params.color}">年度安全工时</b><br/>累计：${h} 小时<br/>约合：${d} 个标准工日`;
          }
          return `<b style="color:${params.color}">连续安全生产</b><br/>当前：${params.value} 天<br/>状态：运行良好`;
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '48%'],
          center: ['70%', '50%'],
          silent: true,
          label: { show: false },
          data: [{ value: 1, itemStyle: { color: 'rgba(255,255,255,0.05)' } }]
        },
        {
          name: '安全指标',
          type: 'pie',
          radius: ['52%', '70%'],
          center: ['70%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#010812',
            borderWidth: 4
          },
          label: {
            show: true,
            position: 'center',
            formatter: () => `{val|${displaySafetyHour || 0}}\n{unit|年度工时(h)}`,
            rich: {
              val: { color: '#fff', fontSize: 28, fontWeight: 'bold', lineHeight: 40 },
              unit: { color: GLOBAL_STYLE.subTextColor, fontSize: 12 }
            }
          },
          data: [
            {
              value: dynamicData?.safetyHours?.continuous?.days || 0,
              name: '连续安全日',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: GLOBAL_STYLE.successColor },
                  { offset: 1, color: 'rgba(0, 255, 204, 0.2)' }
                ])
              }
            },
            {
              value: displaySafetyHour || 0,
              name: '年度安全工时',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: GLOBAL_STYLE.mainColor },
                  { offset: 1, color: 'rgba(0, 242, 255, 0.2)' }
                ])
              }
            }
          ]
        }
      ]
    },

    // 6. 市场开发
    marketDev: {
      backgroundColor: GLOBAL_STYLE.gridBg,
      title: {
        text: "市场开发",
        left: '20',
        top: '15',
        textStyle: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 18, 32, 0.9)',
        borderColor: 'rgba(0, 242, 255, 0.3)',
        textStyle: { color: '#fff' }
      },
      series: [
        {
          name: '完成情况',
          type: 'pie',
          radius: ['20%', '24%'],
          center: ['22%', '55%'],
          label: {
            show: true,
            formatter: '{b}: {c}%',
            color: GLOBAL_STYLE.successColor,
            fontSize: 11,
            edgeDistance: '10%'
          },
          labelLine: {
            show: true,
            length: 40,
            length2: 20,
            lineStyle: { color: GLOBAL_STYLE.successColor }
          },
          data: [
            { value: 85, name: '完成情况', itemStyle: { color: GLOBAL_STYLE.successColor } },
            { value: 15, itemStyle: { color: 'rgba(255,255,255,0.05)' }, label: { show: false }, tooltip: { show: false } }
          ]
        },
        {
          name: '基础指标',
          type: 'pie',
          radius: ['30%', '34%'],
          center: ['22%', '55%'],
          label: {
            show: true,
            formatter: '{b}: {c}%',
            color: GLOBAL_STYLE.mainColor,
            fontSize: 11
          },
          labelLine: {
            show: true,
            length: 25,
            length2: 15,
            lineStyle: { color: GLOBAL_STYLE.mainColor }
          },
          data: [
            { value: 100, name: '基础指标', itemStyle: { color: GLOBAL_STYLE.mainColor } },
            { value: 0, itemStyle: { color: 'transparent' }, label: { show: false } }
          ]
        },
        {
          name: '奋斗指标',
          type: 'pie',
          radius: ['40%', '44%'],
          center: ['22%', '55%'],
          label: {
            show: true,
            formatter: '{b}: {c}%',
            color: '#5b8ff9',
            fontSize: 11
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10,
            lineStyle: { color: '#5b8ff9' }
          },
          data: [
            { value: 70, name: '奋斗指标', itemStyle: { color: '#5b8ff9' } },
            { value: 30, itemStyle: { color: 'rgba(255,255,255,0.05)' }, label: { show: false }, tooltip: { show: false } }
          ]
        },

        {
          name: '工程占比',
          type: 'pie',
          radius: ['30%', '45%'],
          center: ['70%', '55%'],
          itemStyle: {
            borderRadius: 4,
            borderColor: '#010812',
            borderWidth: 2
          },
          data: [
            { value: 40, name: '炼油', itemStyle: { color: GLOBAL_STYLE.subMainColor } },
            { value: 30, name: '油气', itemStyle: { color: '#0070f3' } },
            { value: 20, name: '田地', itemStyle: { color: GLOBAL_STYLE.successColor } },
            { value: 10, name: '双碳', itemStyle: { color: GLOBAL_STYLE.mainColor } },
            { value: 10, name: '其他', itemStyle: { color: '#5b8ff9' } }
          ],
          label: {
            color: '#ccc',
            fontSize: 10,
            formatter: '{b}\n{d}%'
          },
          labelLine: {
            length: 15,
            length2: 15,
            lineStyle: { color: 'rgba(255,255,255,0.2)' }
          }
        }
      ]
    }

  })
};