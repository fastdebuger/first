import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from '@/pages/Procurement/ProcurementSchedule/columns';

type PurchaseStrategySelectProps = {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  filter?: any[];
  displayField?: string; // 显示字段，默认 lot_name
  modalTitle?: string; // 弹窗标题
};

/**
 * 采购进度计划选择输入框组件
 * 交互保持与原 PurchaseStrategySelect 一致：input + 放大镜按钮 + 弹窗表格选择
 * 返回值为所选记录的 form_no
 */
const PurchaseStrategySelect: React.FC<PurchaseStrategySelectProps> = (props) => {
  const {
    value,
    onChange,
    placeholder = '请选择采购进度计划',
    disabled = false,
    filter = [],
    displayField = 'lot_name',
    modalTitle = '选择采购进度计划',
  } = props;

  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>('');

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'topic_name',
        'lot_name',
        'lot_no',
        'site_demand_time_str',
        'procurement_method_str',
        'plan_approve_time_str',
        'doc_prepare_time_str',
        'tech_eval_time_str',
        'comm_eval_time_str',
        'loa_time_str',
        'po_time_str',
        'procurement_wbs_code',
      ])
      .needToHide(['form_no', 'main_form_no']);
    return cols.getNeedColumns();
  };

  const handleSelect = (record: any) => {
    setDisplayValue(record[displayField]);
    onChange?.(record);
    setVisible(false);
  };

  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (selectedRows.length > 0) {
      handleSelect(selectedRows[0]);
    }
    return [];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log(e.target.value,'e.target.value');

    onChange?.(newValue);
  };

  return (
    <>
      <div style={{ display: 'flex', width: '100%' }}>
        <Input
          value={value || displayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          onChange={handleInputChange}
          style={{
            flex: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => !disabled && setVisible(true)}
          disabled={disabled}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeft: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 15px',
            height: '32px',
          }}
        />
      </div>
      <Modal
        title={modalTitle}
        open={visible}
        onCancel={() => setVisible(false)}
        width={'100vw'}
        footer={null}
        style={{
          top: 0,
          maxWidth: '100vw',
          paddingBottom: 0,
          maxHeight: '100vh',
          overflow: 'hidden',
        }}
        bodyStyle={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <BaseCurdSingleTable
          key={new Date() as any}
          rowKey="form_no"
          tableTitle="采购进度计划"
          funcCode="采购进度计划"
          type="purchaseStrategySchedule/getPurchaseStrategySchedule"
          exportType="purchaseStrategySchedule/getPurchaseStrategySchedule"
          importType="purchaseStrategySchedule/getPurchaseStrategySchedule"
          tableColumns={getTableColumns()}
          tableSortOrder={{ sort: 'site_demand_time', order: 'desc' }}
          buttonToolbar={undefined}
          selectedRowsToolbar={renderSelectedRowsToolbar}
          rowSelection={{ type: 'radio' }}
          tableDefaultFilter={filter}
        />
      </Modal>
    </>
  );
};

export default PurchaseStrategySelect;

