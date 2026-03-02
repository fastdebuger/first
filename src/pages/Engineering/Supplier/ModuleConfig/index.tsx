import React, { useState } from 'react';
import SupplierUnitLinkman from './SupplierUnitLinkman';
import { Col, Row, Tree } from 'antd';

const ModuleConfig = () => {

  const [selectedKey, setSelectedKey] = useState('0-0')

  const treeData: any[] = [
    {
      title: '二级单位联络人',
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
          <SupplierUnitLinkman/>
        </Col>
      </Row>
    </div>
  )
}

export default ModuleConfig;
