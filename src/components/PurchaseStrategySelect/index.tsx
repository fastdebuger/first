import React, { useState, useEffect } from 'react';
import { Input, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from '@/pages/Procurement/Overall/columns';

type PurchaseStrategySelectProps = {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  filter?: any[];
  displayField?: string; // 显示字段，默认为 topic_name
  modalTitle?: string; // 弹窗标题
};

/**
 * 总体策略选择输入框组件
 * 包含一个 input 框和右侧的放大镜按钮，点击后弹出总体策略选择弹窗
 */
const PurchaseStrategySelect: React.FC<PurchaseStrategySelectProps> = (props) => {
  const {
    value,
    onChange,
    placeholder = '请选择总体策略',
    disabled = false,
    filter = [],
    displayField = 'topic_name', // 默认显示议题名称
    modalTitle = '选择总体策略',
  } = props;

  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 当外部 value 变化时，更新显示值
  useEffect(() => {
    if (value) {
      // 如果内部有选中的记录且 form_no 匹配，显示名称
      if (selectedRecord && selectedRecord.form_no === value) {
        setDisplayValue(selectedRecord[displayField] || selectedRecord.topic_name || selectedRecord.project_name || '');
      } else if (typeof value === 'string' && value) {
        // 如果没有匹配的记录，暂时显示 form_no
        // 实际使用中，可以通过接口查询获取对应的显示名称
        setDisplayValue(value);
      } else {
        setDisplayValue('');
      }
    } else {
      setDisplayValue('');
      setSelectedRecord(null);
    }
  }, [value, selectedRecord, displayField]);

  // 获取表格列配置
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'RowNumber',
        'form_no',
        {
          title: 'compinfo.wbs_code',
          subTitle: '提报单位',
          dataIndex: 'wbs_name',
          width: 160,
          align: 'center',
        },
        'project_loc_type_str',
        'report_category_str',
        'pre_audit_no',
        'decision_meeting_str',
        'topic_name',
        'batch_number',
        'submit_target_topic',
        'project_overview',
        'project_name',
        'project_code',
        'owner_name',
        'form_maker_name',
        'form_make_time_str',
      ])
      .noNeedToFilterIcon(['RowNumber'])
      .noNeedToSorterIcon(['RowNumber'])
      .needToHide(['form_no']);
    return cols.getNeedColumns();
  };

  // 处理选择
  const handleSelect = (record: any) => {
    // 保存选中的记录
    setSelectedRecord(record);
    // 更新显示值
    const displayText = record[displayField] || record.topic_name || record.project_name || '';
    setDisplayValue(displayText);
    if (onChange) {
      // 直接返回 form_no 作为值
      onChange(record.form_no);
    }
    setVisible(false);
  };

  // 表格行选择工具栏
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (selectedRows.length > 0) {
      handleSelect(selectedRows[0]);
    }
    return [];
  };

  // 处理输入框值变化（允许手动输入）
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    // 如果 onChange 存在，传递字符串值或对象
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', width: '100%' }}>
        <Input
          value={displayValue}
          placeholder={placeholder}
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
          key={new Date()}
          rowKey="form_no"
          tableTitle="总体采购策略"
          funcCode="总体采购策略"
          type="purchaseStrategy/getMaterialsPurchaseStrategy"
          importType="purchaseStrategy/getMaterialsPurchaseStrategy"
          tableColumns={getTableColumns()}
          tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
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
