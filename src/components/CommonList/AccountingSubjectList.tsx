import React, { useEffect, useState } from 'react';
import {Button, Divider, Select, Space } from 'antd';
import { connect } from 'umi';
import {queryTaxAccounting} from "@/services/finance/taxAccounting";
import { PlusOutlined } from '@ant-design/icons';
import TaxAccountingAdd from "@/pages/Finance/Tax/TaxAccounting/Add";

const { Option } = Select;

const AccountingSubjectList: React.FC<any> = (props) => {
  const {
    value,
    onChange,
    size,
    style = {},
    disabled = false,
  } = props;

  const [list, setList] = useState<any[][]>([]);
  const [selectValue, setSelectValue] = useState<any>(undefined);
  const [addVisible, setAddVisible] = useState(false);

  const fetchList = async () => {
    const res = await queryTaxAccounting({
      sort: 'id',
      order: 'asc',
    })
    setList(res.rows || [])
  }

  useEffect(() => {
    if (value) {
      setSelectValue(value);
    } else {
      setSelectValue(undefined);
    }
  }, [value]);

  const handleChange = (_value: string | any) => {
    const findObj = list.find((item: any) => item.accounting_subject === _value);
    if (onChange) onChange(_value, findObj);
    setSelectValue(_value);
  };
  return (
    <>
      <Select
        style={style}
        size={size}
        onFocus={() => fetchList()}
        onChange={handleChange}
        placeholder="会计科目"
        showSearch
        allowClear
        disabled={disabled}
        defaultValue={selectValue}
        value={selectValue}
        filterOption={(input, opt) => {
          // @ts-ignore
          return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
        dropdownRender={menu => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
              <Button type="link" icon={<PlusOutlined />} onClick={() => setAddVisible(true)}>
                新增
              </Button>
            </Space>
          </>
        )}
      >
        {list &&
          list.map((item: any) => {
            return (
              <Option key={item.accounting_subject} value={item.accounting_subject}>
                {item.accounting_subject}（{item.accounting_subject_descripe}）
              </Option>
            );
          })}
      </Select>
      {addVisible && (
        <TaxAccountingAdd
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            fetchList();
          }}
        />
      )}
    </>
  );
};

export default connect()(AccountingSubjectList);
