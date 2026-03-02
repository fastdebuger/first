import React from 'react';
import { Typography } from 'antd';
import { useTheme } from './ThemeContext';
const { Title, Paragraph } = Typography;

/**
 * 数据驾驶舱标题
 * @returns 
 */
const HeaderPage = () => {
  const theme = useTheme();
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{
          margin: 0,
          color: theme.textPrimary,
          fontWeight: 600
        }}>
          市场开发数据驾驶舱
        </Title>
      </div>
      <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
        实时监控市场开发目标完成情况，助力业务决策
      </Paragraph>
    </div>

  )
}

export default HeaderPage