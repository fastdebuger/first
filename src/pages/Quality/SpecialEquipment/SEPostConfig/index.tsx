import React, { useState, useMemo } from 'react';
import { Tabs, Card } from 'antd';
import SEPostConfig from './SEPostConfig';

const SEPostConfigPage = (props: any) => {
  const [activeKey, setActiveKey] = useState("1");

  const tabItems = useMemo(() => [
    { key: '1', label: '压力容器制造(组焊、安装改造修理)' },
    {
      key: '2',
      label: '压力管道',
      children: [
        { key: '1', label: '装置、场站工程', applicable_scenarios: '1' },
        { key: '2', label: '长输管道线路工程', applicable_scenarios: '2' },
      ],
    },
    { key: '3', label: '锅炉' },
    { key: '4', label: '起重机械' },
    { key: '5', label: '压力管道元件' },
  ], []);

  const renderContent = (item: any) => {
    if (item.children) {
      return (
        <div style={{ padding: '8px 0' }}>
          <Tabs
            defaultActiveKey="1"
            type="card" // 二级 Tab 使用卡片样式区分
            size="small"
            items={item.children.map((child: any) => ({
              key: child.key,
              label: child.label,
              children: (
                <div style={{ marginTop: 16 }}>
                  <SEPostConfig
                    applicable_scenarios={child.applicable_scenarios}
                    special_equip_type={item.key}
                    {...props}
                  />
                </div>
              ),
            }))}
          />
        </div>
      );
    }
    return (
      <div style={{ marginTop: 16 }}>
        <SEPostConfig special_equip_type={item.key} {...props} />
      </div>
    );
  };

  const items = tabItems.map(item => ({
    key: item.key,
    label: item.label,
    children: renderContent(item),
  }));

  return (
    <Card bordered={false} bodyStyle={{ padding: '16px 24px' }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        size="large"
        tabBarStyle={{ marginBottom: 0, fontWeight: 500 }}
      />
    </Card>
  );
};

export default SEPostConfigPage;