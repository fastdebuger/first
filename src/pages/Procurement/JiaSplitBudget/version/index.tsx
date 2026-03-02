import React, { useRef, useState } from 'react';
import { Button, Modal, Space, Tag } from "antd";
import { connect } from "umi";
import BaseFormSearchTable from "@/components/BaseFormSearchTable";
import { BasicTableColumns } from 'qcx4-components';
import { configColumns } from "@/pages/Procurement/JiaPurchasePlan/columns";
import VersionDrawer from './versionDrawer'

const VersionModal = (props: any) => {
  const { visible, onCancel, } = props;
  const childRef: any = useRef();
  const [versionRecord, setVersionRecord] = useState<any>({});
  const [versionVisible, setVersionVisible] = useState(false);
  // 定义过滤的条件
  const operator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': [],
    noFilters: [],
  };

  // 定义按钮
  const toolBarRender = () => {
    return [
      <Button
        key={7}
        style={{ borderRadius: 6 }}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, body.columns);
        }}
      >
        导出
      </Button>,
    ];
  };
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'dev_name',
        'unit_project_name',
        'unit_name',
        {
          title: '管线号',
          dataIndex: 'pipe_code',
          align: 'center',
          width: 260,
          render: (text: any, row: any) => {
            return (
              <span>
                <a
                  onClick={() => {
                    setVersionRecord(row);
                    setVersionVisible(true);
                  }}
                >
                  {text}
                </a>
              </span>
            );
          },
        },
      ])
    return cols.getNeedColumns();
  };


  return (
    <>
      <Modal
        title={`需求计划版本`}
        footer={null}
        width={'100vw'}
        style={{ top: 0, maxWidth: "100vw", padding: 0, overflowX: "hidden" }}
        bodyStyle={{ height: "calc(100vh - 55px)", padding: 10, overflowX: "hidden" }}
        onCancel={onCancel}
        visible={visible}
      >
        <BaseFormSearchTable
          cRef={childRef}
          moduleCaption={'需求计划版本'}
          rowKey="RowNumber"
          funcCode={'需求计划版本1' + '_tile'}
          tableSortOrder={{ sort: 'dev_code', order: 'asc' }}
          formColumns={[]}
          rowSelection={false}
          tableColumns={getTableColumns()}
          type="jiapurchaseplan/queryPurchasePlanPipeLst"
          exportType="jiapurchaseplan/queryPurchasePlanPipeLst"
          toolBarRender={toolBarRender}
          operator={operator}
        />
        {versionVisible && versionRecord &&
          <VersionDrawer
            visible={versionVisible}
            selectedRecord={versionRecord}
            onCancel={() => setVersionVisible(false)}
          />}
      </Modal>
    </>
  )
}

export default connect()(VersionModal);
