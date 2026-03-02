import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

const { Option } = Select;

const UnitList: React.FC<any> = (props) => {
  const {
    value,
    record = { unit_project_code: '' },
    unitList,
    onChange,
    labelInValue = false,
    disabled = false,
    initTableSource,
    dispatch,
    style,
  } = props;
  const [selectValue, setSelectValue] = useState(undefined);
  useEffect(() => {
    setSelectValue(undefined);
  }, [record.unit_project_code]);
  useEffect(() => {
    setSelectValue(value);
  }, []);
  useEffect(() => {
    if (!value) {
      setSelectValue(undefined);
    } else {
      setSelectValue(value);
    }
  }, [value]);
  const handleChange = (_value: string | any) => {
    if (initTableSource) {
      initTableSource();
    }
    if (onChange) onChange(_value);
    setSelectValue(_value);
    dispatch({
      type: 'frameno/querySteelStructure',
      payload: {
        sort: 'structure_code',
        order: 'asc',
        filter: JSON.stringify([{ Key: 'unit_code', Val: _value, Operator: '=' }]),
      },
    });
  };
  return (
    <Select
      style={style}
      onChange={handleChange}
      showSearch
      allowClear
      disabled={disabled}
      labelInValue={labelInValue}
      placeholder="单元名称"
      value={selectValue}
      filterOption={(input, opt) => {
        // @ts-ignore
        return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
    >
      {unitList &&
        unitList.map((unitItem: any) => {
          return (
            <Option key={unitItem.unit_code} value={unitItem.unit_code}>
              {unitItem.unit_name}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect(({ common }: ConnectState) => ({
  unitList: common.unitList,
}))(UnitList);
