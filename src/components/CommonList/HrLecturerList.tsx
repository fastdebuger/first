import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import {queryHrLecturer} from "@/services/hr/hrLecturer";

const { Option } = Select;

const HrLecturerList: React.FC<any> = (props) => {
  const {
    value,
    onChange,
    size,
    style = {},
    disabled = false,
  } = props;

  const [list, setList] = useState<any[][]>([]);
  const [selectValue, setSelectValue] = useState<any>([]);

  const fetchList = async () => {
    const res = await queryHrLecturer({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'is_use', Val: '1', Operator: '='}
      ])
    })
    if (res.rows.length > 0) {
      setList(res.rows || [])
      setSelectValue([])
    } else {
      setList([])
      setSelectValue([])
    }
  }

  useEffect(() => {
    fetchList()
  }, []);

  useEffect(() => {
    if (value) {
      setSelectValue(value);
    } else {
      setSelectValue([]);
    }
  }, [value]);

  const handleChange = (_value: string[] | any) => {
    if (onChange) onChange(_value, list);
    setSelectValue(_value);
  };
  return (
    <>
      <Select
        style={style}
        size={size}
        mode={'multiple'}
        onChange={handleChange}
        placeholder="讲师"
        showSearch
        allowClear
        disabled={disabled}
        defaultValue={selectValue}
        value={selectValue}
        filterOption={(input, opt) => {
          // @ts-ignore
          return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
      >
        {list &&
          list.map((item: any) => {
            return (
              <Option key={item.id} value={item.id}>
                {item.user_name} ({item.lecturer_type_str} | {item.lecturer_level_str})
              </Option>
            );
          })}
      </Select>
    </>
  );
};

export default connect()(HrLecturerList);
