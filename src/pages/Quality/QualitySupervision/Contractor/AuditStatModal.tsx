import React, { useEffect, useState, useRef } from 'react';
import { Modal, Spin, Empty, Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import { queryStat } from '@/services/quality/qualityInfo/contractor';

/**
 * 问题统计
 * @returns 
 */
const AuditStatModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 获取统计数据
  const fetchData = async (val?: string) => {
    setLoading(true);
    try {
      const res = await queryStat(
        { problem_category: val, sort: "null" }
      )
      if (res?.errCode === 0) {
        setData(res.rows || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // 渲染图表
  const renderChart = () => {
    if (!chartRef.current || data.length === 0) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const xAxisData = data.map(item => item.problem_category_name);


    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: { interval: 0, rotate: 25, fontSize: 11 }
      },
      yAxis: { type: 'value', name: '数量' },
      series: [{
        name: '问题总数',
        data: data.map(item => item.total_num),
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: (p: any) => data[p.dataIndex].problem_category === "0" ? '#1890ff' : '#52c41a',
          borderRadius: [4, 4, 0, 0]
        },
        label: { show: true, position: 'top' }
      }]
    };

    chartInstance.current.setOption(option);
  };

  // 3. 处理弹窗开关逻辑
  useEffect(() => {
    if (visible) {
      fetchData(category);
    } else {
      // 销毁实例
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    }
  }, [visible, category]);

  // 4. 数据变化后重绘
  useEffect(() => {
    if (visible && data.length > 0) {
      const timer = setTimeout(renderChart, 200);
      return () => clearTimeout(timer);
    }
  }, [data, visible]);

  return (
    <>
      {/* 外部触发按钮 */}
      <Button
        type="primary"
        icon={<BarChartOutlined />}
        onClick={() => setVisible(true)}
      >
        问题统计
      </Button>

      <Modal
        title="质量监督审核问题统计"
        open={visible}
        onCancel={() => setVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>
        ]}
        destroyOnClose
      >
        {/* <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <span>问题归类：</span>
          <Select
            placeholder="筛选归类"
            style={{ width: 200 }}
            allowClear
            onChange={(val) => setCategory(val)}
            options={[
              { label: '质量管理类', value: '0' },
              { label: '质量实体类', value: '1' },
            ]}
          />
        </Space> */}

        <Spin spinning={loading}>
          <div style={{ minHeight: 450 }}>
            {data.length > 0 ? (
              <div ref={chartRef} style={{ width: '100%', height: '450px' }} />
            ) : (
              <Empty style={{ paddingTop: 120 }} description="暂无相关统计数据" />
            )}
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default AuditStatModal;