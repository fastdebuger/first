import React, { useState, useEffect } from 'react';
import { Input, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from '@/pages/Quality/QualityReport/OverallQualityProducts/OverallQualityProductsView/columns';

type ContractSelectInputProps = {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  filter?: any[];
  funcCode?: string;
  type?: string;
  importType?: string;
  tableTitle?: string;
  displayField?: string; // 显示字段，默认为 project_in_progress_name
  modalTitle?: string; // 弹窗标题
};

/**
 * 工程产品总体质量概述选择输入框组件
 * 包含一个 input 框和右侧的放大镜按钮，点击后弹出工程产品总体质量概述选择弹窗
 */
const ContractSelectInput: React.FC<ContractSelectInputProps> = (props) => {
  const {
    value,
    onChange,
    placeholder = '请选择工程产品总体质量概述',
    disabled = false,
    filter = [],
    funcCode,
    type = "qualityProjectQualityOverview/getQualityProjectQualityOverview",
    importType = "qualityProjectQualityOverview/getQualityProjectQualityOverview",
    tableTitle = "工程产品总体质量概述",
    modalTitle = '选择工程产品总体质量概述',
    displayField = 'project_in_progress_name',
  } = props;

  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>('');

  // 获取表格列配置
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "project_in_progress_name",
        "major_quality_activities",
        "award_info",
        "form_maker_name",
        "form_make_time_str",
        "type_code_str",
      ])
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
      .needToExport([
        "project_in_progress_name",
        "major_quality_activities",
        "award_info",
        "form_maker_name",
        "form_make_time_str",
        "type_code_str",
      ]);
    return cols.getNeedColumns();
  };

  // 处理选择
  const handleSelect = (record: any) => {
    if (onChange) {
      onChange(record);
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

  // 处理输入框值变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    // 如果 onChange 存在，传递字符串值
    if (onChange) {
      onChange(newValue);
    }
  };

  // 当 value 变化时，更新显示值
  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        setDisplayValue(value);
      } else if (typeof value === 'object' && value[displayField]) {
        setDisplayValue(value[displayField]);
      }
    } else {
      setDisplayValue('');
    }
  }, [value, displayField]);

  return (
    <>
      <div style={{ display: 'flex', width: '100%' }}>
        <Input
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
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
          overflow: 'hidden'
        }}
      >
        <BaseCurdSingleTable
          rowKey="id"
          tableTitle={tableTitle}
          funcCode={funcCode+'qualityProjectQualityOverview'}
          type={type}
          importType={importType}
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

export default ContractSelectInput;
