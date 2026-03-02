import React, { useState, useEffect } from 'react';
import { Input, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from '@/pages/Contract/Income/columns';
import { getDepTitle } from '@/utils/utils';
import { WBS_CODE } from '@/common/const';

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
  displayField?: string; // 显示字段，默认为 contract_name
  modalTitle?: string; // 弹窗标题
};

/**
 * 合同选择输入框组件
 * 包含一个 input 框和右侧的放大镜按钮，点击后弹出合同选择弹窗
 */
const ContractSelectInput: React.FC<ContractSelectInputProps> = (props) => {
  const {
    value,
    onChange,
    placeholder = '请选择合同',
    disabled = false,
    filter = [],
    funcCode = "shouruhetongselect",
    type = "income/getIncomeInfo",
    importType = "income/getIncomeInfo",
    tableTitle = "收入合同台账",
    modalTitle = '选择合同',
  } = props;

  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>('');

  // 获取表格列配置
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        'contract_no',
        "wbs_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        'owner_unit_name',
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "revenue_method_str",
        {
          title: 'contract.file_url',
          dataIndex: 'file_url',
          subTitle: '文件',
          align: 'center',
          width: 160,
          render: (text: any) => {
            if (text) {
              return (
                <Button
                  onClick={() => window.open(text)}
                  size='small'
                  type='link'
                >下载文件</Button>
              )
            }
            return ''
          }
        },
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "branch_comp_code",
        "dep_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        "owner_unit_name",
        "project_location",
        "contract_no",
        "wbs_code",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "revenue_method_str",
        'file_url',
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
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

  return (
    <>
      <div style={{ display: 'flex', width: '100%' }}>
        <Input
          value={displayValue || value}
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
          key={new Date()}
          rowKey="RowNumber"
          tableTitle={tableTitle}
          funcCode={funcCode}
          type={type}
          importType={importType}
          tableColumns={getTableColumns()}
          tableSortOrder={{ sort: 'form_make_time', order: 'desc' }}
          buttonToolbar={undefined}
          selectedRowsToolbar={renderSelectedRowsToolbar}
          rowSelection={{ type: 'radio' }}
          tableDefaultFilter={
            [
              { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' },
              { Key: 'settlement_management_id', Val: '0', Operator: '=' },
              ...filter,
            ]
          }
        />
      </Modal>
    </>
  );
};

export default ContractSelectInput;
