import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { BasicTableColumns } from 'qcx4-components';
import { configColumns } from './columns';
import { connect, useIntl } from 'umi';
import BaseFormBakData from '@/components/BaseFormBakData';

const FormBakDataModal: React.FC<any> = (props) => {
  const { form, onOk, scroll = { y: 'calc(80vh - 260px)' } } = props;
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [defaultFields, setDefaultFields] = useState({});

  // 监听物料信息的改变 触发重新加载表格
  const getTableColumns = () => {
    const col = new BasicTableColumns(configColumns);
    return col
      .initTableColumns([
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
      ])
      .getNeedColumns();
  };
  // 定义过滤的条件
  const operator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': [],
    noFilters: [],
  };

  return (
    <>
      <Button
        type="primary"
        key={1}
        onClick={async () => {
          await form.current.validateFields();
          setDefaultFields({});
          setVisible(true);
        }}
      >
        {formatMessage({ id: 'common.add' })}
      </Button>
      {visible && (
        <Modal
          width="97%"
          title={formatMessage({ id: 'material.select.data' })}
          style={{ top: 20 }}
          bodyStyle={{ height: 'calc(100vh - 160px)', overflowY: 'hidden' }}
          visible={visible}
          onOk={() => {
            onOk(selectedRows);
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
        >
          <BaseFormBakData
            rowKey="RowNumber"
            operator={operator}
            scroll={scroll}
            tableSortOrder={{ sort: 'form_no', order: 'desc' }}
            tableColumns={getTableColumns()}
            type="balancedLiquidity/queryBakData"
            onSelectedCallBack={(keys: any, rows: any) => {
              setSelectedRows(rows);
            }}
            tableDefaultField={defaultFields}
          />
        </Modal>
      )}
    </>
  );
};
export default connect()(FormBakDataModal);
