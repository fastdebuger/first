import React, { useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { configColumns } from '../columns';
// @ts-ignore
import { BasicTableColumns, SingleTable } from 'yayang-ui';
import EditModal from '../GenerateProcurementPlan';
import { connect } from 'dva';
import { ErrorCode } from '@/common/const';
import { useIntl } from 'umi';

const { CrudQueryDetailDrawer } = SingleTable;
const { confirm } = Modal;
import { ExclamationCircleOutlined } from "@ant-design/icons";
/**
 * @param props
 * @constructor
 */
const ClsConfigDetail: React.FC<any> = (props: any) => {
  const { open, onClose, selectedRecord, actionRef, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const { formatMessage } = useIntl();

  const handleDel = () => {
    confirm({
      title: '是否删除当前的数据吗?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      okText: formatMessage({ id: 'common.yes' }),
      cancelText: formatMessage({ id: 'common.no' }),
      onOk() {
        return new Promise((resolve: any) => {
          dispatch({
            type: 'balancedLiquidity/deleteBalanceInventory',
            payload: {
              id: selectedRecord.id,
            },
            callback: (res: any) => {
              resolve();
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("删除成功");
                if (onClose) onClose();
                if (actionRef.current) {
                  actionRef.current.reloadTable();
                }
              }
            },
          });
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      },
    });
  };

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'prod_code',
      "form_no_show",
      "plan_num",
      "out_storage_num",
      "out_storage_cancel_num",
      "borrow_num",
      "storage_prod_num",
      "balance_number",
      "po_number",
      "surplus_number",
      "purchase_number",
      "prod_describe",
      "unit",
    ]);
    cols.tableColumns.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      // <Button type={'primary'} onClick={() => setEditVisible(true)}>
      //   编辑
      // </Button>,
      // <Button danger type={'primary'} onClick={() => handleDel()}>
      //   删除
      // </Button>,
    ];
  };


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="total_cls_name"
        title="物料分类配置信息详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      />
      {editVisible && (
        <EditModal
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
    </>
  );
};

export default connect()(ClsConfigDetail);
