import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
/**
 * Echarts容器
 * @param param
 * @returns 
 */
const ChartItem: React.FC<{ option: any }> = ({ option }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark');
    }

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current && option) {
      chartInstance.current.setOption({
        ...option,
        backgroundColor: 'transparent',
      });
    }
  }, [option]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: '200px' }} />;
};

export default ChartItem;