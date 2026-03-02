import React, { useEffect, useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { queryProgressPaymentPriceRatio } from '@/services/contract/income';
import { Spin, Alert, Statistic, Row, Col } from 'antd';

// 定义组件的props类型
interface ProgressPaymentPageProps {
  selectedRecord: {
    id: string | number;
    name?: string;
  }
}

// 后端返回的数据结构类型
interface ProgressPaymentData {
  contract_say_price: string;
  progress_payment_price: string;
  settlement_management_price: string;
  price_ratio: string;
}

/**
 * 进度款统计分析页面
 * 使用 ECharts 渲染复合环形图
 */
const ProgressPaymentPage: React.FC<ProgressPaymentPageProps> = ({ selectedRecord }) => {
  const [data, setData] = useState<ProgressPaymentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await queryProgressPaymentPriceRatio({
          sort: 'id',
          order: 'desc',
          filter: JSON.stringify([
            { Key: 'id', Val: selectedRecord.id, Operator: '=' }
          ])
        });
        setData(result?.rows?.[0] || null);
        setError(null);
      } catch (err) {
        setError('数据加载失败，请检查网络或API服务。');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedRecord.id]);


  // --- ECharts 配置 ---
  const option = useMemo(() => {
    if (!data) return {};

    const contractPrice = parseFloat(data.contract_say_price);
    const progressPrice = parseFloat(data.progress_payment_price);
    const remainingPrice = contractPrice - progressPrice;

    // 确保剩余金额不为负
    const finalRemainingPrice = remainingPrice > 0 ? remainingPrice : 0;

    // 进度款和未支付金额
    const chartData = [
      { value: progressPrice, name: '进度款' },
      { value: finalRemainingPrice, name: '未支付金额' },
    ];

    // 颜色列表
    const colorList = ['#115FEA', '#EE6666'];

    // 计算数据总和 (合同总价)
    const sum = contractPrice;

    // 定义环形间隙大小（固定为总和的 1% 作为间隙）
    const gap = (1 * sum) / 100

    // 处理饼图数据：生成带间隙的环形数据
    const pieData1: any[] = [] // 外层带圆角环形
    const pieData2: any[] = [] // 内层半透明环形
    const gapData = {
      name: '',
      value: gap,
      itemStyle: {
        color: 'transparent' // 间隙部分设为透明
      },
      tooltip: { show: false } // 间隙不显示 tooltip
    }

    for (let i = 0; i < chartData.length; i++) {
      // 跳过 value 为 0 的项，避免渲染不必要的间隙
      if (chartData[i].value <= 0) continue;

      const colorIndex = i % colorList.length;

      // 第一圈数据：外层环形，带圆角样式
      pieData1.push({
        ...chartData[i],
        itemStyle: {
          borderRadius: 10, // 环形区块的圆角
          color: colorList[colorIndex]
        }
      });
      pieData1.push(gapData);

      // 第二圈数据：内层半透明环形，用于视觉层次
      pieData2.push({
        ...chartData[i],
        itemStyle: {
          color: colorList[colorIndex],
          opacity: 0.21 // 半透明效果
        }
      });
      pieData2.push(gapData);
    }

    // 如果只有一项数据，需要移除末尾多余的间隙
    if (pieData1.length > 0 && pieData1[pieData1.length - 1] === gapData) {
      pieData1.pop();
      pieData2.pop();
    }

    const totalPercentage = parseFloat(data.price_ratio || "0");

    return {
      backgroundColor: 'transparent',
      title: {
        text: '合同支付进度',
        subtext: selectedRecord.name ? `项目：${selectedRecord.name}` : '',
        left: 'center',
        top: 10,
        textStyle: {
          color: '#324458',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },

      // Tooltip 配置
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const formatter = (value: any) => `¥ ${value}`;
          if (params.name === '') return null;
          return `${params?.name}: ${formatter(params?.value)}`;
        }
      },

      // 图例配置
      legend: {
        orient: 'vertical',
        right: 20,
        top: 'center',
        align: 'left',
        itemGap: 20,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: 'rgba(50, 68, 88, 1)',
          fontSize: 14
        },
        formatter: (name: string) => {

          const item = chartData.find(item => item.name === name);
          const value = item ? parseFloat(item.value) : 'N/A';
          return `${name}  ¥ ${value}`;
        },
        data: chartData.map(item => item.name).filter(name => name)
      },

      // 中心文字配置 (使用 graphic 代替仪表盘)
      graphic: {
        elements: [
          // 中间文字-数字 (百分比)
          {
            type: 'text',
            left: 'center', // 确保居中
            top: '45%',
            style: {
              text: `${totalPercentage.toFixed(2)}%`, // 使用计算出的百分比
              fill: '#115FEA',
              fontSize: 36,
              fontWeight: 'bold',
              textAlign: 'center'
            }
          },
          // 中间文字-“进度款占比”
          {
            type: 'text',
            left: 'center',
            top: '58%',
            style: {
              text: '进度款占比',
              fill: '#666',
              fontSize: 14,
              textAlign: 'center'
            }
          }
        ]
      },

      // 颜色列表
      color: colorList,

      // 系列配置
      series: [
        // 1. 外层带圆角环形 (主要展示)
        {
          name: '合同支付比例',
          type: 'pie',
          roundCap: true,
          radius: ['66%', '70%'],
          center: ['50%', '55%'], // 调整中心位置到 50%
          label: { show: false },
          labelLine: { show: false },
          data: pieData1,
          z: 3 // 确保在最上层
        },
        // 2. 内层半透明环形 (背景效果)
        {
          type: 'pie',
          radius: ['54%', '70%'], // 调整半径，使其与外层环形对齐
          center: ['50%', '55%'],
          label: { show: false },
          labelLine: { show: false },
          silent: true,
          data: pieData2,
          z: 2 // 在中间层
        },
        // 3. 最内层背景圆 (中心背景色)
        {
          type: 'pie',
          center: ['50%', '55%'],
          radius: [0, '50%'], // 覆盖中心区域
          label: { show: false },
          labelLine: { show: false },
          itemStyle: {
            color: 'rgba(17, 95, 234, 0.05)' // 浅蓝色半透明作为背景
          },
          silent: true,
          data: [{ value: 1, name: '' }],
          z: 1 // 在最底层
        }
      ]
    };
  }, [data, selectedRecord.name]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="数据加载中..." /></div>;
  }

  if (error && !data) {
    return <Alert message="错误" description={error} type="error" showIcon />;
  }

  if (!data) {
    return <Alert message="提示" description="没有可用的统计数据。" type="info" showIcon />;
  }

  const formatter = (value: any) => `¥ ${value}`;
  const contractPrice = parseFloat(data.contract_say_price);
  const progressPrice = parseFloat(data.progress_payment_price);
  const settlementPrice = parseFloat(data.settlement_management_price);

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '400px',
        fontFamily: 'Arial, sans-serif'
      }}>

      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="合同总金额"
            value={contractPrice}
            precision={0}
            formatter={formatter}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="累计进度款"
            value={progressPrice}
            precision={0}
            formatter={formatter}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="已结算金额"
            value={settlementPrice}
            precision={0}
            formatter={formatter}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
      </Row>

      <div
        style={{
          marginTop: 50
        }}
      >
        <ReactECharts
          option={option}
          style={{ height: '400px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
};

export default ProgressPaymentPage;