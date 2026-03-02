import React, { useEffect, useRef, useMemo } from 'react';
import { Card, Col, Typography } from 'antd';
import * as echarts from 'echarts';
import TableDetail from './TableDetail';

const { Text } = Typography;

// 经典配色方案
const CLASSIC_COLORS = [
  ['#3AA1FF', '#36cbcb'], 
  ['#4ECB73', '#95de64'], 
  ['#FBD437', '#fff566'], 
  ['#F2637B', '#ff85c0'], 
  ['#975FE4', '#b37feb'], 
  ['#8c8c8c', '#bfbfbf'], 
];
/**
 * 各类工程占比
 * @param props 
 * @returns 
 */
const ProjectProportionChart: React.FC<any> = (props: any) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { engineeringData = [] } = props;

  const sortedPieData = useMemo(() => {
    if (!Array.isArray(engineeringData)) return [];
    return [...engineeringData]
      .map(item => ({
        name: item.engineering_name || '未知业务',
        value: Number(item.engineering_value) || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index) => {
        const colorPair = CLASSIC_COLORS[index % CLASSIC_COLORS.length];
        return {
          ...item,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorPair[0] },
              { offset: 1, color: colorPair[1] }
            ]),
            borderColor: '#fff',
            borderWidth: 2,
          }
        };
      });
  }, [engineeringData]);

  const TOTAL_VALUE = useMemo(() => {
    return sortedPieData.reduce((sum, item) => sum + item.value, 0);
  }, [sortedPieData]);

  const option = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c}",
      },
      series: [
        {
          name: "业务占比",
          type: "pie",
          radius: '55%', 
          center: ["50%", "50%"],
          startAngle: 90, 
          data: sortedPieData,
          label: {
            show: true,
            position: "outer",
            formatter: (params: any) => {
              const name = params.name || '';
              const finalName = name.replace(/(.{10})/g, '$1\n');
              return `${finalName}: {value|${params.value}}(亿元)`;
            },
            rich: {
              value: {
                color: '#000000ff',
                fontWeight: 'bold',
                lineHeight: 20
              },
            },
            textStyle: {
              fontSize: 13,
              color: "#666",
            },
          },
          labelLine: {
            show: true,
            length: 15,   
            length2: 25,  
            smooth: true,
          },
        },
      ],
      graphic: [
        {
          type: 'text',
          right: '5%',
          top: '5%',
          style: {
            text: `总额: ${TOTAL_VALUE.toFixed(2)} 亿`,
            fill: '#1f2329',
            fontSize: 13,
            fontWeight: '600'
          },
        }
      ]
    } as echarts.EChartsOption;
  }, [sortedPieData, TOTAL_VALUE]);

  useEffect(() => {
    let chart: echarts.ECharts | null = null;
    if (chartRef.current) {
      chart = echarts.init(chartRef.current);
      chart.setOption(option);
    }
    const handleResize = () => chart?.resize();
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
              各类工程占比
            </Text>
          </div>
        }
        bordered={false}
        hoverable
        style={{
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          height: '100%'
        }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 56px)' }}
        extra={<TableDetail engineeringData={engineeringData} />}
      >
        <div 
          ref={chartRef} 
          style={{ 
            height: 450,
            width: '100%',
            padding: '20px' 
          }} 
        />
      </Card>
    </Col>
  );
};

export default ProjectProportionChart;