import { Tabs } from 'antd';
import React from 'react'
import { connect } from 'umi';
import QualitySafetyInspectionPage from './QualitySafetyInspectionPage';
import QualitySafetyInspectionAwaitingInspectionPage from './QualitySafetyInspectionAwaitingInspectionPage';

const QualitySafetyInspectionTabs = (props = {}) => {
  return (
    <Tabs
      destroyInactiveTabPane
      style={{
        padding: 8
      }}
    >
      <Tabs.TabPane tab="全部" key="item-1">
        <QualitySafetyInspectionPage
          {...props}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="待我检查" key="item-2">
        <QualitySafetyInspectionAwaitingInspectionPage
          {...props}
        />
      </Tabs.TabPane>
    </Tabs>
  )
}


export default connect()(QualitySafetyInspectionTabs);
