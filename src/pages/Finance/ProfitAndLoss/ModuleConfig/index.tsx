import React, {useEffect, useState } from 'react';
import { Col, Row, Tree } from 'antd';
import {ConnectState} from "@/models/connect";
import {connect} from "umi";
import LockResource from "@/pages/Finance/ProfitAndLoss/ModuleConfig/LockResource";

const ModuleConfig = ({sysBasicDictList}: any) => {

  const [selectedKey, setSelectedKey] = useState('0-0');

  const treeData: any[] = [
    {
      title: '在建项目资源结转情况',
      key: '0-0',
    },
  ];
  const onSelect: any['onSelect'] = (_selectedKeys, info) => {
    console.log('selected', _selectedKeys, info);
    setSelectedKey(_selectedKeys[0])
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={4}>
          <Tree
            defaultExpandedKeys={['0-0']}
            selectedKeys={[selectedKey]}
            onSelect={onSelect}
            treeData={treeData}
          />
        </Col>
        <Col span={20} style={{borderLeft: '1px solid #ccc', paddingLeft: 16}}>
          <LockResource sysBasicDictList={sysBasicDictList}/>
        </Col>
      </Row>
    </div>
  )
}
export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(ModuleConfig);
