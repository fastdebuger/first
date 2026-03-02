import React from 'react'
import { TrophyOutlined } from '@ant-design/icons'
import { Card, Col, Statistic, Typography } from 'antd'
import { useTheme } from './ThemeContext';


const { Text } = Typography;

/**
 * 数据卡片
 * 用在顶部 KPI 卡片
 * @param props 
 * @returns 
 */
const ColCard = (props: any) => {

  const {
    value,
    color = "success",
    textColor = "textSecondary",
    bgCard = "bgCard",
    text = "已完成总额 (亿元)"
  } = props;

  const theme: any = useTheme();

  return (
    <Col xs={24} sm={12} lg={10} xl={8}>
      <Card
        bordered={false}
        hoverable
        style={{
          background: theme[bgCard],
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease'
        }}
      >
        <Statistic
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TrophyOutlined style={{ color: theme[color], marginRight: 8 }} />
              <Text style={{ color: theme[textColor] }}>{text}</Text>
            </div>
          }
          value={value}
          precision={0}
          valueStyle={{
            color: theme[textColor],
            fontSize: '36px',
            fontWeight: 600,
            marginTop: 8,
            textAlign: "center"
          }}
        />
      </Card>
    </Col>
  )
}

export default ColCard