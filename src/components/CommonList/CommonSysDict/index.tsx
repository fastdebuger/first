import React, { useEffect, useState } from 'react';
import {Badge, Button, Divider, message, Select, Space } from 'antd';
import { connect } from 'umi';
import {DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Add from "./Add";
import type {ConnectState} from "@/models/connect";

const { Option } = Select;

const CommonSysDict: React.FC<any> = (props) => {
  const {
    value,
    onChange,
    size,
    style = {},
    disabled = false,
    type = '',
    title = '',
    sysBasicDictList,
    dispatch,
    isNeedColor = false,
    noAdd = false,
  } = props;

  const [list, setList] = useState<any[][]>([]);
  const [selectValue, setSelectValue] = useState<any>(undefined);
  const [addVisible, setAddVisible] = useState(false);

  useEffect(() => {
    if (type) {
      const filterArr = sysBasicDictList.filter((r: any) => r.type === type);
      setList(filterArr);
    }
  }, [sysBasicDictList.length]);

  useEffect(() => {
    if (value) {
      setSelectValue(`${value}`);
    } else {
      setSelectValue(undefined);
    }
  }, [value]);

  const handleChange = (_value: string | any) => {
    const findObj = list.find((item: any) => item.value === _value);
    if (onChange) onChange(_value, findObj);
    setSelectValue(_value);
  };
  return (
    <>
      <Select
        style={style}
        size={size}
        onChange={handleChange}
        placeholder={title}
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
            {!noAdd && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Button type="link" icon={<PlusOutlined />} onClick={() => {
                    if (!type) {
                      message.warn('未传类型，无法新增')
                    }
                    setAddVisible(true)
                  }}>
                    新增
                  </Button>
                </Space>
              </>
            )}
          </>
        )}
      >
        {list &&
          list.map((item: any) => {
            return (
              <Option key={item.value} value={item.value}>
                {item.color ? (<Badge color={item.color} text={item.label} />) : item.label}
              </Option>
            );
          })}
      </Select>
      {addVisible && (
        <Add
          type={type}
          title={title}
          isNeedColor={isNeedColor}
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            dispatch({
              type: 'common/querySysBasicDict',
              payload: {
                sort: 'id',
                order: 'asc',
              }
            })
          }}
        />
      )}
    </>
  );
};


export default connect(({ common }: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList
}))(CommonSysDict);
