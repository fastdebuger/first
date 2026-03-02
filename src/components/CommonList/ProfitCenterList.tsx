import React, { useEffect, useState } from 'react';
import { Button, Divider, Select, Space } from 'antd';
import { connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { queryProfitCenter } from "@/services/finance/profitCenter";
import ProfitCenterAdd from "@/pages/Finance/ProfitCenter/Add";

const { Option } = Select;

const ProfitCenterList: React.FC<any> = (props) => {
  const {
    value,
    onChange,
    size,
    style = {},
    disabled = false,
  } = props;
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');

  const [list, setList] = useState<any[][]>([]);
  const [selectValue, setSelectValue] = useState<any>(undefined);
  const [addVisible, setAddVisible] = useState(false);

  const fetchList = async () => {
    const res = await queryProfitCenter({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify(
        [{ "Key": "profit_wbs_code", "Val": depCode + '%', "Operator": "like" }]
      )
    })
    if (res.rows.length > 0) {
      setList(res.rows || [])
      const findObj = res.rows.find(r => r.profit_wbs_code === depCode);
      if (findObj && findObj.profit_center_code) {
        setSelectValue(findObj.profit_center_code)
        onChange(findObj.profit_center_code, findObj)
      }
    } else {
      setList([])
      setSelectValue(undefined)
    }
  }

  useEffect(() => {
    fetchList()
  }, []);

  useEffect(() => {
    if (value) {
      setSelectValue(value);
    } else {
      setSelectValue(undefined);
    }
  }, [value]);

  const handleChange = (_value: string | any) => {
    const findObj = list.find((item: any) => item.profit_center_code === _value);
    if (onChange) onChange(_value, findObj);
    setSelectValue(_value);
  };
  return (
    <>
      <Select
        style={style}
        size={size}
        onChange={handleChange}
        placeholder="利润中心"
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
              <Option key={item.profit_center_code} value={item.profit_center_code}>
                {item.profit_center_code}（{item.profit_wbs_name}）
              </Option>
            );
          })}
      </Select>
      {addVisible && (
        <ProfitCenterAdd
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

export default connect()(ProfitCenterList);
