import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

const { Option } = Select;

const DevList: React.FC<any> = (props) => {
  const {
    value,
    dispatch,
    devList,
    onChange,
    labelInValue = false,
    size,
    style = {},
    disabled = false,
  } = props;
  const [selectValue, setSelectValue] = useState<any>(undefined);
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'common/fetchDevList',
      });
      // dispatch({
      //   type: 'common/fetchUnitProjectList',
      //   payload: {
      //     devCode: '',
      //   },
      // });
      // dispatch({
      //   type: 'common/fetchUnitList',
      //   payload: {
      //     unitProjectCode: '',
      //   },
      // });
    }
    if (value) {
      setSelectValue(value);
    } else {
      if (labelInValue) {
        const defaultField = { key: '', value: '', label: '' };
        setSelectValue(defaultField);
        if (onChange) onChange(defaultField);
      } else {
        setSelectValue(undefined);
      }
    }
  }, [value]);
  const handleChange = (_value: string | any) => {
    const changeValue = labelInValue ? _value.value : _value;
    if (onChange) onChange(_value);
    setSelectValue(_value);
    dispatch({
      type: 'common/fetchUnitProjectList',
      payload: {
        devCode: changeValue,
      },
    });
  };
  return (
    <Select
      style={style}
      size={size}
      onChange={handleChange}
      labelInValue={labelInValue}
      placeholder="装置名称"
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
      {devList &&
        devList.map((devItem: any) => {
          return (
            <Option key={devItem.dev_code} value={devItem.dev_code}>
              {devItem.dev_name}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect(({ common }: ConnectState) => ({
  devList: common.devList,
}))(DevList);
