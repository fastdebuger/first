import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { configColumns } from '../columns';
import { BasicTableColumns, SingleTable } from 'yayang-ui';
import PartEdit from '../Edit';
import { connect } from 'umi';
import { ErrorCode } from '@/common/const';
import { hasPermission } from '@/utils/authority';
import WarningList from './WarningList';
const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 应急预案模板详情
 * @param props 
 * @returns 
 */
const EmergencyPlanDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, actionRef, dispatch, authority } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const [bodyData, setBodyData] = useState([]);

  /**
   * 查询应急预案模板内容
   * @param props 
   * @returns 
   */
  useEffect(() => {
    let form_no = selectedRecord?.form_no;
    if (form_no) {
      dispatch({
        type: 'emergencyplan/queryContingencyPlanConfigBody',
        payload: {
          sort: 'order_num',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'form_no', Val: form_no, Operator: '=' }
          ]),
        },
        callback: (res: any) => {
          const result = res?.rows || []
          setBodyData(result);
        },
      });
    }
  }, [selectedRecord]);

  /**
   * 列配置
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'plan_name',
      "applicable_area",
      "scene",
      "punishment_principle",
      // "disposal_process",
      "contract_say_price",
    ]);
    return cols.getNeedColumns();
  };

  /**
   * 按钮组
   * @returns 
   */
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

  /**
   * 删除
   */
  const handleDel = () => {
    dispatch({
      type: 'emergencyplan/delContingencyPlanConfig',
      payload: {
        form_no: selectedRecord.form_no,
      },
      callback: (res: { errCode: number }) => {
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
        title="应急预案详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >

        {/* 气象预警级别详情 */}
        <WarningList initialData={bodyData} />
      </CrudQueryDetailDrawer>
      {editVisible && (
        <PartEdit
          visible={editVisible}
          record={selectedRecord}
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
        <p>是否删除当前的数据?</p>
      </Modal>
    </>
  );
};

export default connect()(EmergencyPlanDetail);
