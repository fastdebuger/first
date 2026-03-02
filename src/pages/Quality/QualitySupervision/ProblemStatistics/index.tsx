import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import ProblemGradingStatistics from './ProblemGradingStatistics';
import BranchProjectStatistics from './BranchProjectStatistics';
import ProblemClassificationStatistics from './ProblemClassificationStatistics';
import ProblemLevelStatistics from './ProblemLevelStatistics';
import ViolationUnitStatistics from './ViolationUnitStatistics';
import ProfessionalSystemStatistics from './ProfessionalSystemStatistics';
import ProblemCategoryStatistics from './ProblemCategoryStatistics';
import ProblemTrendStatistics from './ProblemTrendStatistics';
import './index.less';

const { TabPane } = Tabs;

/**
 * 问题统计模块主页面
 * 包含多个统计子页面，通过 Tab 切换展示不同的统计维度
 */
const ProblemStatisticsPage: React.FC = () => {
  // localStorage.getItem('auth-default-wbs-prop-key') === 'dep' ? '2' : '1'
  const [activeKey, setActiveKey] = useState("2");
  const [tabMountKeys, setTabMountKeys] = useState<Record<string, number>>({});

  /** Tab 列表配置 */
  const tabList = [
    // { key: '1', tab: '问题统计', component: ProblemGradingStatistics, componentKey: 'problem-grading' },
    { key: '2', tab: '分公司、项目部问题统计', component: BranchProjectStatistics, componentKey: 'branch-project' },
    { key: '3', tab: '问题归类统计', component: ProblemClassificationStatistics, componentKey: 'problem-classification' },
    { key: '4', tab: '问题分级统计', component: ProblemLevelStatistics, componentKey: 'problem-level' },
    { key: '5', tab: '违章单位数据统计', component: ViolationUnitStatistics, componentKey: 'violation-unit' },
    { key: '6', tab: '专业系统问题统计', component: ProfessionalSystemStatistics, componentKey: 'professional-system' },
    // { key: '7', tab: '问题类别统计', component: ProblemCategoryStatistics, componentKey: 'problem-category' },
    // { key: '8', tab: '问题发展趋势', component: ProblemTrendStatistics, componentKey: 'problem-trend' },
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

