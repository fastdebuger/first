import React from 'react';
import { Row, Col, Typography } from 'antd';
import SafetyRecordDisplay from './SafetyRecordDisplay';
import AnnualSafetyHours from './AnnualSafetyHours';

const { Title } = Typography;

/**
 * 数据驾驶舱布局组件
 */
const DashboardLayout: React.FC = () => {
  return (
    <div style={{
      padding: '16px',
      minHeight: '100vh',
    }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        安全生产驾驶舱数据看板
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <SafetyRecordDisplay />
        </Col>
        <Col xs={24} lg={12}>
          <AnnualSafetyHours />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardLayout;