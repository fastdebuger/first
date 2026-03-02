import { Tabs } from 'antd';
import React from 'react';
import { connect } from 'umi';
import ProjectDepartmentLedger from './ProjectDepartmentLedger';
import CompanyWideLedger from './CompanyWideLedger';
import { PROP_KEY } from '@/common/const';

const TabsApp: React.FC = (props) => {

  return (
    <Tabs style={{ padding: 8 }} defaultActiveKey="1">
      {
        PROP_KEY === "branchComp" && (
          <Tabs.TabPane tab="全部台账" key="1">
            <ProjectDepartmentLedger {...props} />
          </Tabs.TabPane>
        )
      }
      {
        PROP_KEY === "subComp" && (
          <>
            <Tabs.TabPane tab="分公司台账" key="1">
              <ProjectDepartmentLedger {...props} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="全公司台账" key="2">
              < CompanyWideLedger  {...props} />
            </Tabs.TabPane>
          </>
        )
      }
      {
        PROP_KEY === "dep" && (
          <>
            <Tabs.TabPane tab="项目部台账" key="1">
              <ProjectDepartmentLedger {...props} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="全公司台账" key="2">
              < CompanyWideLedger  {...props} />
            </Tabs.TabPane>
          </>
        )
      }

    </Tabs>
  )
};

export default connect()(TabsApp);
