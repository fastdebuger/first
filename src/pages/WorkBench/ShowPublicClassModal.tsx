import React, { useEffect } from 'react';
import {Col, Empty, Modal, Row, Skeleton, Space, Tree } from 'antd';
import {queryHrCourseMaterial} from "@/services/hr/hrCourseMaterial";
import {deepArr} from "@/utils/utils-array";
import ShowOnlyOfficeInfo from "@/pages/HR/Common/ShowOnlyOfficeInfo";

const ModalItem = (props: any) => {
  const { selectedCourse } = props;
  const [loading, setLoading] = React.useState(false);
  const [selectedMaterialItem, setSelectedMaterialItem] = React.useState<any>(null);
  const [selectedKeys, setSelectedKeys] = React.useState<any>([]);
  const [treeData, setTreeData] = React.useState<any>([
    {
      title: '全部资料',
      key: '0-0-0',
      children: []
    }
  ]);


  const fetchCourseMaterialList = async () => {
    setLoading(true);
    const res = await queryHrCourseMaterial({
      sort: 'create_ts',
      order: 'desc',
      filter: JSON.stringify([{"Key":"course_id","Val": selectedCourse.id,"Operator":"="}]),
    })
    setLoading(false);
    if(res.rows.length > 0) {
      res.rows.forEach((item) => {
        Object.assign(item, {
          title: item.material_name,
          key: item.id
        })
      })
      const copyTreeData = deepArr(treeData)
      copyTreeData[0].children = res.rows || [];
      setTreeData(copyTreeData);
      setSelectedMaterialItem(res.rows[0]);
      setSelectedKeys([res.rows[0].id])
    }
  }

  useEffect(() => {
    fetchCourseMaterialList();
  }, []);

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    setSelectedKeys(selectedKeys);
    setSelectedMaterialItem(info.node);
  };

  return (
    <Skeleton loading={loading} >
      <Row gutter={16}>
        <Col span={6}>
          <Tree
            showLine
            selectedKeys={selectedKeys}
            defaultExpandedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={treeData}
          />
        </Col>
        <Col span={18}>
          {selectedMaterialItem ? (
            <>
              <ShowOnlyOfficeInfo
                url={selectedMaterialItem.material_url}
                fileName={selectedMaterialItem.material_name}
              />·
            </>
          ) : (
            <Empty description={'无内容'} />
          )}
        </Col>
      </Row>
    </Skeleton>
  )
}

const ShowPublicClassModal = (props: any) => {

  const { visible, onCancel, selectedCourse } = props;

  return (
    <div>
      {visible && (
        <Modal
          title={selectedCourse.course_name}
          visible={visible}
          onCancel={onCancel}
          destroyOnClose={true}
          width={'80vw'}
          maskClosable={false}
          style={{
            top: 10,
            maxWidth: '100vw',
            paddingBottom: 0,
            minHeight: '100vh',
            overflow: 'hidden',
          }}
          bodyStyle={{ height: 'calc(100vh - 35px)', marginTop: '-20px' }}
          footer={null}
        >
          <ModalItem selectedCourse={selectedCourse}/>
        </Modal>
      )}
    </div>
  )
}

export default ShowPublicClassModal;
