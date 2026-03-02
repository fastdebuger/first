import React from 'react';
import { Row, Divider, Spin } from 'antd';

import ColCard from './ColCard';
import HeaderPage from './HeaderPage';
import MarketProgressChart from './MarketProgressChart';
import ProjectProportionChart from './ProjectProportionChart';
import { connect } from 'umi';
import useData from './useData';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './ThemeContext';

/**
 * 驾驶舱主组件
 */
const ExperienceDashboard: React.FC<any> = (props) => {
  const { dispatch } = props;
  /**
   * 获取数据驾驶舱的数据
   */
  const { loading, indicatorsData, engineeringData } = useData({
    dispatch
  });

  /**
   * 获取上下文的主题颜色
   */
  const theme = useTheme();

  const bgCard = new Array(3).fill("bgCard");
  const color = ["success", "warning", "danger"];
  const textColor = ["textSecondary", "warning", "danger"];

  return (
    <ThemeProvider>
      <div style={{
        padding: 16,
        background: theme.bgLight,
        height: 'calc(100vh - 88px)',
        overflowY: "scroll",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <Spin spinning={loading} tip="数据加载中..." size="large">
          {/* 页面头部 */}
          <HeaderPage />
          <Divider style={{ margin: '16px 0' }} />

          {/* --- 区域 1: 顶部 KPI 卡片 --- */}
          <Row gutter={[20, 20]} style={{ marginBottom: 16 }}>
            {
              indicatorsData.map((item, index) => {
                return (
                  <ColCard
                    value={item.engineering_value || 0}
                    text={item.engineering_name}
                    bgCard={bgCard[index]}
                    color={color[index]}
                    textColor={textColor[index]}
                  />
                )
              })
            }
          </Row>

          {/* --- 区域 2: 图表区域 --- */}
          <Row gutter={[20, 20]}>
            {/* 左侧：市场开发完成情况 */}
            <MarketProgressChart
              indicatorsDataArray={indicatorsData}
            />

            {/* 右侧：各类工程占比 */}
            <ProjectProportionChart
              engineeringData={engineeringData}
            />
          </Row>
        </Spin>
      </div>
    </ThemeProvider>

  );
};

export default connect()(ExperienceDashboard);