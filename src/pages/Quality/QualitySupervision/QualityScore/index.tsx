import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Statistic, Spin, message, Typography, DatePicker, Space, Button, Divider } from 'antd';
import {
  FileSearchOutlined,
  OrderedListOutlined,
  UserOutlined,
  UserDeleteOutlined,
  MoneyCollectOutlined,
  SolutionOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { queryQualityScoringStat } from '@/services/quality/qualityInfo/rewardPunishment';
import dayjs from 'dayjs';
import moment from 'moment';
import Detail from './Detail';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// 定义全局配置常量
const STAT_CONFIG = {
  PROBLEM_COUNT: { type: '1', title: '总问题数量', icon: <FileSearchOutlined />, color: '#1890ff', unit: '个' },
  TOTAL_SCORE: { type: '2', title: '总记分', icon: <OrderedListOutlined />, color: '#f5222d', unit: '分' },
  PERSON_COUNT: { type: '3', title: '记分总人数', icon: <UserOutlined />, color: '#722ed1', unit: '人' },
  CONTRACTOR_BLACK_PENALTY: { type: '4', title: '人员惩罚总额', icon: <MoneyCollectOutlined />, color: '#fa8c16', unit: '元' },
  PERSON: { type: '5', title: '承包商拉黑总数', icon: <UserDeleteOutlined />, color: '#52c41a', unit: '家' },
  CONTRACTOR_PENALTY: { type: '6', title: '承包商惩罚总额', icon: <SolutionOutlined />, color: '#13c2c2', unit: '元' },
};

const FIELD_MAP: Record<string, string> = {
  '1': 'total_problem_count',
  '2': 'total_scoring_score',
  '3': 'total_person_count',
  '4': 'total_person_penalty_amount',
  '5': 'contractor_blacklist_count',
  '6': 'total_contractor_penalty_amount',
};

/**
 * 质量记分问题统计
 * @returns 
 */
const QualityScoringDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [statData, setStatData] = useState<any[]>([]);
  const [tempDateRange, setTempDateRange] = useState<any>(null);
  const [actualParams, setActualParams] = useState<any>({});
  const [open, setOpen] = useState(false);

  // 查询所有的数据
  const fetchAllStats = useCallback(async (params: any) => {
    setLoading(true);
    try {
      const types = Object.values(STAT_CONFIG).map(item => item.type);
      const results = await Promise.all(
        types.map(type => queryQualityScoringStat({
          ...params,
          sort: "null",
          statType: type
        }))
      );

      const formatted = Object.keys(STAT_CONFIG).map((key, index) => {
        const config = (STAT_CONFIG as any)[key];
        const res = results[index];
        const fieldName = FIELD_MAP[config.type];
        const value = res?.rows?.[0]?.[fieldName] || 0;

        return { ...config, key, value: Number(value) };
      });
      setStatData(formatted);
    } catch (error) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStats({});
  }, [fetchAllStats]);

  // 查询数据
  const handleSearch = () => {
    const params: any = {};
    if (tempDateRange && tempDateRange[0] && tempDateRange[1]) {
      params.start_date = tempDateRange[0].startOf('day').unix();
      params.end_date = tempDateRange[1].endOf('day').unix();
    }
    setActualParams(params);
    fetchAllStats(params);
  };

  // 重置数据
  const handleReset = () => {
    setTempDateRange(null);
    setActualParams({});
    fetchAllStats({});
  };

  return (
    <div style={{ padding: '16px', background: '#fff', minHeight: '100%' }}>
      {/* 标题与搜索区域 */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0, borderLeft: '4px solid #1890ff', paddingLeft: '12px' }}>
              质量记分问题统计
            </Title>
          </Col>
          <Col>
            <Space size="middle">
              <Text type="secondary">统计日期：</Text>
              <RangePicker
                value={tempDateRange}
                onChange={(val) => {
                  setTempDateRange(val)
                }}
                allowClear
                placeholder={['开始日期', '结束日期']}
                renderExtraFooter={() => (
                  <div style={{ textAlign: 'left' }}>
                    <Button type="link" size="small" onClick={() => {
                      const range: [moment.Moment, moment.Moment] = [
                        moment().subtract(1, 'year').startOf('day'),
                        moment().endOf('day')
                      ];
                      setTempDateRange(range);
                    }}>
                      今年
                    </Button>
                  </div>
                )}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider style={{ marginTop: 0 }} />

      {/* 统计卡片区域 */}
      <Spin spinning={loading} tip="正在加载统计数据...">
        <Row gutter={[16, 16]}>
          {statData.map((item) => (
            <Col xs={24} sm={12} md={8} lg={4} key={item.key}>
              <Card
                bordered={true}
                hoverable
                bodyStyle={{
                  padding: '20px'
                }}
                onClick={() => setOpen(true)}
              >
                <Statistic
                  title={
                    <Space style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>
                      <span style={{ color: item.color }}>{item.icon}</span>
                      {item.title}
                    </Space>
                  }
                  value={item.value}
                  precision={item.key.endsWith('PENALTY') ? 2 : 0}
                  valueStyle={{ color: '#262626', fontSize: '24px', fontWeight: '500' }}
                  suffix={<span style={{ fontSize: '12px', marginLeft: 4 }}>{item.unit}</span>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <div style={{
        marginTop: 32,
        padding: '24px',
        border: '1px dashed #d9d9d9',
        borderRadius: '8px',
        textAlign: 'center',
        background: '#fafafa'
      }}>
        <Text type="secondary">
          {actualParams.start_date
            ? (
              <Space>
                数据范围：
                <Text strong>{dayjs.unix(actualParams.start_date).format('YYYY-MM-DD')}</Text>
                至
                <Text strong>{dayjs.unix(actualParams.end_date).format('YYYY-MM-DD')}</Text>
              </Space>
            )
            : '当前展示全部历史数据统计结果'}
        </Text>
      </div>

      {open && (
        <Detail
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default QualityScoringDashboard;