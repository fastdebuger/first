import React, { useRef, useCallback } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { getPieOption, getCloseStatusPieOption, getBarOption } from './chartOptions';
import { downloadChart } from '../problemStatisticsUtils';

interface NormalChartsProps {
  chartData: any;
  chartKey: number;
  onChartClick?: () => void;
}

/**
 * 普通统计图表组件（两个饼状图 + 柱状图）
 * 布局：第一行两个饼状图，第二行一个柱状图
 */
const NormalCharts: React.FC<NormalChartsProps> = ({
  chartData,
  chartKey,
  onChartClick,
}) => {
  const pieChartRef = useRef<any>(null);
  const closeStatusPieChartRef = useRef<any>(null);
  const barChartRef = useRef<any>(null);

  /** 处理图表下载 */
  const handleDownload = useCallback((chartRef: any, filename: string) => {
    downloadChart(chartRef, filename);
  }, []);

  return (
    <div>
      {/* 第一行：两个饼状图 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            title="问题级别分布（饼状图）"
            size="small"
            extra={
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(pieChartRef, '问题级别分布')}
              >
                下载图表
              </Button>
            }
          >
            <ReactECharts
              ref={pieChartRef}
              key={`pie-chart-${chartKey}`}
              option={getPieOption(chartData.pieData || [])}
              style={{ height: '400px', cursor: onChartClick ? 'pointer' : 'default' }}
              opts={{ renderer: 'canvas' }}
              notMerge={false}
              lazyUpdate={false}
              onEvents={onChartClick ? { click: onChartClick } : undefined}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="关闭/未关闭分布（饼状图）"
            size="small"
            extra={
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(closeStatusPieChartRef, '关闭未关闭分布')}
              >
                下载图表
              </Button>
            }
          >
            <ReactECharts
              ref={closeStatusPieChartRef}
              key={`close-status-pie-chart-${chartKey}`}
              option={getCloseStatusPieOption(chartData.closeStatusPieData || [])}
              style={{ height: '400px', cursor: onChartClick ? 'pointer' : 'default' }}
              opts={{ renderer: 'canvas' }}
              notMerge={false}
              lazyUpdate={false}
              onEvents={onChartClick ? { click: onChartClick } : undefined}
            />
          </Card>
        </Col>
      </Row>

      {/* 第二行：柱状图 */}
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="质量问题和HSE问题对比（柱状图）"
            size="small"
            extra={
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(barChartRef, '质量问题和HSE问题对比')}
              >
                下载图表
              </Button>
            }
          >
            <ReactECharts
              ref={barChartRef}
              key={`bar-chart-${chartKey}`}
              option={getBarOption(chartData)}
              style={{ height: '400px', cursor: onChartClick ? 'pointer' : 'default' }}
              opts={{ renderer: 'canvas' }}
              notMerge={false}
              lazyUpdate={false}
              onEvents={onChartClick ? { click: onChartClick } : undefined}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NormalCharts;

