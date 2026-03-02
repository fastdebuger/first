import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { BasicTableColumns } from 'qcx4-components';
import { configColumns } from '@/pages/Procurement/Base/ProdInfo/columns';
import { connect, useIntl } from 'umi';
import BaseFormBakData from '@/components/BaseFormBakData';
import { getTS } from '@/utils/utils-date';

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
        'prod_name',
        'aid_name',
        'cls_name',
        'material',
        'spec',
        'unit',
        'unit_weight',
        'material_type',
        'prod_describe',
        'standard',
        'remark',
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
          const values = await form.current.validateFields();
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
          bodyStyle={{ height: 'calc(100vh - 160px)', overflowY: 'auto' }}
          visible={visible}
          onOk={() => {
            onOk(selectedRows);
            setVisible(false);
          }}
          onCancel={() => setVisible(false)}
        >
          <BaseFormBakData
            rowKey="prod_code"
            operator={operator}
            scroll={scroll}
            tableSortOrder={{ sort: 'upload_ts', order: 'desc' }}
            tableColumns={getTableColumns()}
            type="matreialprodinfo/getMatreialProdInfo"
            onSelectedCallBack={(keys: any, rows: any) => {
              rows.forEach((item: any) => {
                Object.assign(item, { demand_time: getTS() });
              });
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
