import React, { useState, useEffect } from 'react';
import { Input, Button, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { userSelectConfigColumns } from './columns';

export type UserSelectValue = {
  user_code?: string;
  user_name?: string;
  [key: string]: any;
};

type UserSelectProps = {
  value?: string;
  onChange?: (value: string, record?: UserSelectValue) => void;
  placeholder?: string;
  disabled?: boolean;
  displayField?: 'user_code' | 'user_name';
  modalTitle?: string;
  tableTitle?: string;
  filter?: any[];
};

/**
 * 用户选择输入框组件
 * 包含一个 input 框和右侧的放大镜按钮，点击后弹出用户选择弹窗
 * 使用 BasicTableColumns 与 BaseCurdSingleTable，接口为 /basic/user/aut/queryUserInfo
 */
const UserSelect: React.FC<UserSelectProps> = (props) => {
  const {
    value,
    onChange,
    placeholder = '请选择用户',
    disabled = false,
    modalTitle = '选择用户',
    tableTitle = '用户列表',
    filter = [],
  } = props;

  const [visible, setVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>('');

  const getTableColumns = () => {
    const cols = new BasicTableColumns(userSelectConfigColumns);
    cols
      .initTableColumns([
        'user_code',
        'user_name',
        'id_no',
        'group_name',
        'tel_num',
        'email',
        'sex',
        'last_login_ts_str',
        'valid',
        'remark',
      ]);
    return cols.getNeedColumns();
  };

  const handleSelect = (record: UserSelectValue) => {
    const code = record?.user_code ?? '';
    const name = record?.user_name ?? code;
    setDisplayValue(name);
    if (onChange) {
      onChange(name, record);
    }
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
    setDisplayValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      setDisplayValue('');
    }
  }, [value]);

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
        width="100vw"
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
          key={String(visible)}
          rowKey="user_code"
          tableTitle={tableTitle}
          funcCode="userselect"
          type="common/queryUserInfo"
          importType="common/queryUserInfo"
          tableColumns={getTableColumns()}
          tableSortOrder={{ sort: 'user_code', order: 'asc' }}
          buttonToolbar={undefined}
          selectedRowsToolbar={renderSelectedRowsToolbar}
          rowSelection={{ type: 'radio' }}
          tableDefaultFilter={[
            { Key: 'other_account', Val: '01', Operator: '=' },
            ...filter,
          ]}
        />
      </Modal>
    </>
  );
};

export default UserSelect;
