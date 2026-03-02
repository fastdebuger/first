import React, { useEffect, useRef, useMemo } from 'react';
import { Card, Col, Typography, Row } from 'antd';
import * as echarts from 'echarts';
import TableDetail from './TableDetail';

const { Text } = Typography;

interface IMarketProgressChart {
  indicatorsDataArray: any[]
}
/**
 * 市场开发完成情况
 * 采用多层圆环图展示：奋斗指标、基准指标、已完成
 * @constructor
 */
const MarketProgressChart: React.FC<IMarketProgressChart> = (props) => {
  const { indicatorsDataArray = [] } = props;
  const chartRef = useRef<HTMLDivElement>(null);

  // 配置对象
  const option = useMemo(() => {
    // --- 最大的进度条占据约半圆（180度）的空间 ---
    const VISUAL_MAX = 181;

    // 以奋斗为基准，将所有数值归一化到 180 的进度值 [0,1,2]
    const MAX_PROGRESS_VALUE = indicatorsDataArray?.[2]?.engineering_value || 0

    // 计算 ECharts 进度值 (Value)
    const pieDatas = indicatorsDataArray.map(item => ({
      "value": ((item.engineering_value / MAX_PROGRESS_VALUE) * 180),
      "name": item.engineering_name,
      "target": item.engineering_value,
    })).toReversed()

    let series: echarts.EChartsOption['series'] = [];
    let maxRadius = 80; // 最外层圆环的半径（百分比）
    let barWidth = 10; // 进度条的宽度
    let barGap = 10; // 环与环之间的间距

    const barColor = ["#F8A1A4", "#FFD8B1", "#B5EAD7"];
    const center_Y = "60%";

    pieDatas.forEach((item, i) => {
      // 计算当前环的内外半径
      const startRadius = (maxRadius - i * (barGap + barWidth));
      const endRadius = (maxRadius - (i + 1) * barWidth - i * barGap);

      // Series: 进度部分 (当前值)
      series.push({
        type: 'pie',
        clockWise: true,
        hoverAnimation: false,
        radius: [endRadius + '%', startRadius + '%'],
        center: ["50%", center_Y],
        // startAngle: 180,
        label: { show: false },
        data: [{
          value: item.value,
          target: item.target,
          name: item.name,
          itemStyle: {
            color: barColor[i % barColor.length],
            borderRadius: 100,
          }
        }, {
          value: VISUAL_MAX - item.value,
          name: '',
          label: {
            show: true,
            position: 'outside',
            formatter: `{nm|${item.name}}\n{num|${item.target}}{unit|亿}`,
            rich: {
              nm: { color: '#666', fontSize: 13, padding: [0, 0, 5, 0] },
              num: { color: '#333', fontSize: 18, fontWeight: 'bold', fontFamily: 'Arial' },
              unit: { color: '#999', fontSize: 12, padding: [0, 0, 0, 2] }
            }
          },
          labelLine: {
            show: true,
            length: 25 + i * 15,
            length2: 40,
            smooth: 0.3,
            lineStyle: { width: 1, color: '#ccc' }
          },
          itemStyle: {
            color: "transparent",
          },
        }]
      } as echarts.SeriesOption);

      // Series: 背景圆环
      series.push({
        name: '',
        type: 'pie',
        silent: true,
        z: 0,
        clockWise: false,
        hoverAnimation: false,
        radius: [endRadius + '%', startRadius + '%'],
        center: ["50%", center_Y],
        // startAngle: 180,
        label: { show: true },
        data: [{
          // 背景值固定为 VISUAL_MAX
          value: VISUAL_MAX,
          itemStyle: {
            color: "rgba(235, 239, 247, 0.4)",
          },
        }]
      } as echarts.SeriesOption);
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params: any) {
          const { name, data } = params;
          if (!data?.target) {
            return name;
          }
          // const ratio = (data.target / MAX_PROGRESS_VALUE) * 100;
          return `${name}：${data.target.toFixed(0)} 亿元`;
        }
      },
      xAxis: [{ show: false }],
      yAxis: [{ show: false }],
      grid: { top: '15%', bottom: '30%', left: "30%", containLabel: false },

      // 图表中心文本配置
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '54%',
          style: {
            text: indicatorsDataArray?.[0]?.engineering_value && '已完成',
            fill: '#666',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 'normal',
          },
          z: 100,
          cursor: 'default',
        },
        {
          type: 'text',
          left: 'center',
          top: '60%',
          style: {
            text: indicatorsDataArray?.[0]?.engineering_value ? `${indicatorsDataArray?.[0]?.engineering_value}亿` : "",
            fill: '#333',
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'bold',
          },
          z: 100,
          cursor: 'default',
        }
      ],
      // 图例配置
      legend: {
        show: false,
        orient: 'horizontal',
        top: '5%',
        left: 'center',
        formatter: function (name: string) {
          const data = pieDatas.find(n => n.name === name);
          if (!data) {
            return name;
          }
          const ratio = (data.target / MAX_PROGRESS_VALUE) * 100;
          return `${name} ${ratio.toFixed(0)}%`;
        },
        textStyle: {
          fontSize: 14,
        }
      },
      series: series,
    } as echarts.EChartsOption;
  }, [indicatorsDataArray.length]);

  useEffect(() => {
    let chart: echarts.ECharts | null = null;

    if (chartRef.current) {
      chart = echarts.init(chartRef.current);
      chart.setOption(option);
    }

    const handleResize = () => {
      chart?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart?.dispose();
    };
  }, [option]);

  return (
    <Col xs={24} lg={12}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ color: '#1f2329', fontSize: 16 }}>
              市场开发完成情况
            </Text>
          </div>
        }
        bordered={false}
        hoverable
        style={{
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          height: '100%',
        }}
        bodyStyle={{ padding: 24 }}
        extra={<TableDetail indicatorsData={indicatorsDataArray} />}
      >
        <Row justify="center">
          <div
            ref={chartRef}
            style={{ height: 350, width: '100%', minWidth: 300 }}
          />
        </Row>
      </Card>
    </Col>
  );
};

export default MarketProgressChart;