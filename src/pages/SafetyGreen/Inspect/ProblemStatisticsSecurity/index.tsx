import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import ProfessionalSystemStatistics from './ProfessionalSystemStatistics';
import './index.less';

const { TabPane } = Tabs;

/**
 * 问题统计模块主页面
 * 包含多个统计子页面，通过 Tab 切换展示不同的统计维度
 */
const ProblemStatisticsPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState("6");
  const [tabMountKeys, setTabMountKeys] = useState<Record<string, number>>({});

  /** Tab 列表配置 */
  const tabList = [
    { key: '6', tab: '安全要素统计', component: ProfessionalSystemStatistics, componentKey: 'professional-system' },
  ];

  /** 处理 Tab 切换 */
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    // 每次切换tab时，更新对应tab的挂载key，强制组件重新挂载
    setTabMountKeys(prev => ({
      ...prev,
      [key]: Date.now(),
    }));
  };

  return (
    <div className="problem-statistics-container">
      <Card className="problem-statistics-card">
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          type="card"
          destroyInactiveTabPane={false}
          className="problem-statistics-tabs"
        >
          {tabList.map(item => {
            const Component = item.component;
            const mountKey = tabMountKeys[item.key] || 0;
            if (localStorage.getItem('auth-default-wbs-prop-key') === 'dep' && item.key === '1') {
              return
            }
            return (
              <TabPane tab={item.tab} key={item.key}>
                <div className="problem-statistics-content">
                  <Component key={`${item.componentKey}-${mountKey}`} />
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
    </div>
  );
};

export default ProblemStatisticsPage;

