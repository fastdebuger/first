import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

const { Option } = Select;

const UnitProjectList: React.FC<any> = (props) => {
  const {
    value,
    dispatch,
    unitProjectList,
    onChange,
    labelInValue = false,
    disabled = false,
    style = {},
    size,
    allowClear = true,
  } = props;
  const defaultDevCode = localStorage.getItem('auth-cpecc-selected-devCode');
  const [selectValue, setSelectValue] = useState(undefined);
  useEffect(() => {
    dispatch({
      type: 'common/fetchUnitProjectList',
      payload: {
        devCode: defaultDevCode,
      },
    });
    dispatch({
      type: 'common/fetchUnitList',
    });
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
    const changeValue = labelInValue ? _value.value : _value;
    if (onChange) onChange(_value);
    setSelectValue(_value);
    dispatch({
      type: 'common/fetchUnitList',
      payload: {
        unitProjectCode: changeValue,
      },
    });
  };
  console.log(unitProjectList);
  return (
    <Select
      size={size}
      style={style}
      onChange={handleChange}
      showSearch
      allowClear={allowClear}
      disabled={disabled}
      labelInValue={labelInValue}
      placeholder="单位工程名称"
      value={selectValue}
      filterOption={(input, opt) => {
        // @ts-ignore
        return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
    >
      {unitProjectList &&
        unitProjectList.map((unitProjectItem: any) => {
          return (
            <Option
              key={unitProjectItem.unit_project_code}
              value={unitProjectItem.unit_project_code}
            >
              {unitProjectItem.unit_project_name}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect(({ common }: ConnectState) => ({
  unitProjectList: common.unitProjectList,
}))(UnitProjectList);
