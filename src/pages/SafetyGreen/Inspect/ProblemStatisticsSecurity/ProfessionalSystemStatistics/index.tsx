import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Space, DatePicker, Row, Col, Modal, Table, Spin, Select } from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';
import { getQualitySafetyInspectionSystemStatisticsByHse } from '@/services/quality/qualityInfo/contractor';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 专业系统问题统计
 * @returns 
 */
const ProfessionalSystemStatistics: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const DEFAULT_TYPE = "1";
  const DEFAULT_DATES: [moment.Moment, moment.Moment] = [moment().subtract(1, 'year'), moment()];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [statType, setStatType] = useState<string>(DEFAULT_TYPE);
  const [dates, setDates] = useState<[moment.Moment, moment.Moment]>(DEFAULT_DATES);

  // 获取不同维度的数据
  const getDisplayName = (item: any) => {
    if (statType === "3") return item.quality_factor1 || item.problem_category_name;
    if (statType === "4") return item.quality_factor2 || item.problem_category_name;
    return item.problem_category_name || '未知分类';
  };

  const renderChart = () => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.on('click', () => setModalVisible(true));
    }

    // 基于数值进行降序排列
    const sortedData = [...data].sort((a, b) => (b.problem_num || 0) - (a.problem_num || 0));

    const option = {
      backgroundColor: '#fff',
      title: {
        text: '专业系统问题统计',
        left: 'center',
        textStyle: { fontSize: 18, color: '#333', fontWeight: '500' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        extraCssText: 'box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 4px;',
        textStyle: { color: '#666' }
      },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: sortedData.map(item => getDisplayName(item)),
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: '#BFBFBF' } },
        axisLabel: {
          interval: 0,
          rotate: sortedData.length > 5 ? 35 : 0,
          color: '#595959'
        }
      },
      yAxis: {
        type: 'value',
        name: '问题数量 (个)',
        minInterval: 1,
        min: 0,
        splitLine: { lineStyle: { type: 'dashed', color: '#F0F0F0' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [{
        name: '问题数量',
        type: 'bar',
        barMaxWidth: 50,
        barCategoryGap: '50%',
        data: sortedData.map(item => item.problem_num),
        itemStyle: {
          color: (p: any) => {
            const rawItem = sortedData[p.dataIndex];
            return rawItem.problem_category === "0" ? '#1890ff' : '#52c41a';
          },
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: '#666',
          fontWeight: 'bold'
        },
        emphasis: {
          itemStyle: { opacity: 0.8 }
        }
      }]
    };

    chartInstance.current.setOption(option, true);
  };

  useEffect(() => {
    renderChart()
  }, [data, statType]);

  useEffect(() => {
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  // 数据请求
  const fetchData = async (currentDates = dates, currentType = statType) => {
    if (!currentDates) return;
    setLoading(true);
    try {
      const start = Math.floor(currentDates[0].valueOf() / 1000).toString();
      const end = Math.floor(currentDates[1].valueOf() / 1000).toString();

      const res = await getQualitySafetyInspectionSystemStatisticsByHse({
        statType: currentType,
        startDate: start,
        endDate: end,
        sort: "problem_category",
      });

      if (res?.errCode === 0) {
        setData(res.rows || []);
      } else {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  };
  // 数据重置
  const handleReset = () => {
    setStatType(DEFAULT_TYPE);
    setDates(DEFAULT_DATES);
    fetchData(DEFAULT_DATES, DEFAULT_TYPE);
  };

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <Card bordered={false} bodyStyle={{ padding: '24px' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, marginRight: 8 }}>分析维度：</span>
              <Select
                value={statType}
                style={{ width: 260 }}
                onChange={(val) => {
                  setStatType(val);
                  fetchData(dates, val);
                }}
              >
                <Option value="1">按照质量分析</Option>
                <Option value="2">按照质量问题归类分析</Option>
                <Option value="3">按照管理类一级要素分析</Option>
                <Option value="4">按照管理类二级要素分析</Option>
                <Option value="5">按照质量实体类分析</Option>
              </Select>
            </div>
            <RangePicker value={dates} onChange={(val) => setDates(val as any)} />
            <Button type="primary" onClick={() => fetchData()}>查询</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Col>
      </Row>

      <Spin spinning={loading} tip="正在加载数据...">
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #f0f0f0', padding: '20px' }}>
          {data.length > 0 ? (
            <div ref={chartRef} style={{ width: '100%', height: '520px' }} />
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '180px', height: '520px', color: '#bfbfbf' }}>
              暂无匹配数据，请尝试调整筛选条件
            </div>
          )}
        </div>
      </Spin>

      <Modal
        title="专业系统问题统计"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
        destroyOnClose
      >
        <Table
          dataSource={data}
          columns={[
            { title: '问题大类', dataIndex: 'problem_category_name', width: 150 },
            { title: '统计维度', key: 'name', render: (r) => getDisplayName(r) },
            {
              title: '问题数量',
              dataIndex: 'problem_num',
              align: 'right',
              sorter: (a, b) => a.problem_num - b.problem_num,
              render: (val) => <b style={{ color: '#1890ff' }}>{val}</b>
            }
          ]}
          rowKey={(r, i) => i}
          pagination={false}
          size="middle"
          bordered
        />
      </Modal>
    </Card>
  );
};

export default ProfessionalSystemStatistics;