import React, { useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { configColumns } from '../columns';

import { BasicTableColumns, SingleTable } from 'yayang-ui';
import PartEdit from '../Edit';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { hasPermission } from '@/utils/authority';

const { CrudQueryDetailDrawer } = SingleTable;

const PartDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, actionRef, dispatch, authority } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        "min_price",
        "max_price",

        "project_level_str",
        "contract_mode_str",
        'owner_group_str'
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "max_price",
        "min_price",
        "project_level_str",
        "contract_mode_str",
        'owner_group_str'
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button
        key={authority + 'edit'}
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={'primary'}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      <Button
        key={authority + 'del'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={'primary'}
        onClick={() => setDelVisible(true)}
      >
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: 'income/deletePriceLevel',
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('删除成功');
          setTimeout(() => {
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="contract_no"
        title="等级详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        {/*<Tabs defaultActiveKey="1">*/}
        {/*  <Tabs.TabPane tab="构件清单" key="1">*/}
        {/*    {JSON.stringify(selectedRecord)}*/}
        {/*  </Tabs.TabPane>*/}
        {/*</Tabs>*/}
      </CrudQueryDetailDrawer>
      {editVisible && (
        <PartEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackAddSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={'primary'} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>是否删除当前的数据: {selectedRecord.part_number_code}</p>
      </Modal>
    </>
  );
};

export default connect()(PartDetail);
