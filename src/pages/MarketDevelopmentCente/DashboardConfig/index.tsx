import { Tabs } from 'antd';
import React from 'react';
import Engineering from "./Engineering"
import DataTypeConfig from './DataTypeConfig';

/**
 * 数据驾驶舱配置
 * @param props 
 * @returns 
 */
const DashboardConfig: React.FC<any> = (props) => {
  const { route: { authority } } = props;
  return (
    <div
      style={{
        padding: 8
      }}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="市场开发完成情况配置" key="1">
          <Engineering
            authority={authority}
            config_type="1"
            title="市场开发完成情况"
            tableTotalAddAbleCheck={3}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="各类工程占比配置" key="2">
          <Engineering
            authority={authority}
            config_type="2"
            title="各类工程占比"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="知识库管理数据类型配置表信息" key="3">
          <DataTypeConfig authority={authority} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default DashboardConfig;