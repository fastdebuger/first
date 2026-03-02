import React, { useRef, useCallback } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { getBranchCompanyBarOption } from './chartOptions';
import { downloadChart } from '../problemStatisticsUtils';

interface BranchCompanyChartProps {
  chartData: any;
  chartKey: number;
  onChartClick?: () => void;
}

/**
 * 分公司统计图表组件
 * 展示各分公司质量问题和HSE问题的对比柱状图
 */
const BranchCompanyChart: React.FC<BranchCompanyChartProps> = ({
  chartData,
  chartKey,
  onChartClick,
}) => {
  const chartRef = useRef<any>(null);

  /** 处理图表下载 */
  const handleDownload = useCallback(() => {
    downloadChart(chartRef, '分公司问题统计');
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          type="link"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
        >
          下载图表
        </Button>
      </div>
      <ReactECharts
        ref={chartRef}
        key={`branch-bar-chart-${chartKey}`}
        option={getBranchCompanyBarOption(chartData)}
        style={{ height: '400px', cursor: onChartClick ? 'pointer' : 'default' }}
        opts={{ renderer: 'canvas' }}
        notMerge={false}
        lazyUpdate={false}
        onEvents={onChartClick ? { click: onChartClick } : undefined}
      />
    </div>
  );
};

export default BranchCompanyChart;

