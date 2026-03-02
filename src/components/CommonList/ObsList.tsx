import React, { useEffect } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import { ObsLevel } from '@/common/const';

const { Option } = Select;

const ObsList: React.FC<any> = (props) => {
  const {
    dispatch,
    value,
    obsList,
    onChange,
    labelInValue = false,
    style,
    disabled = false,
    initTableSource,
  } = props;
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'common/fetchObsList',
        payload: {
          sort: 'obs_code',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'level_no', Val: ObsLevel.LEVEL_PROJECT_OBS_LIST, Operator: '=' },
          ]),
        },
      });
      dispatch({
        type: 'common/fetchOuterUserList',
        payload: {
          sort: 'user_code',
          order: 'asc',
        },
      });
    }
  }, []);
  const handleChange = (_value: string | any) => {
    if (initTableSource) {
      initTableSource();
    }
    const changeValue = labelInValue ? _value.value : _value;
    if (onChange) onChange(_value);
    dispatch({
      type: 'common/fetchOuterUserList',
      payload: {
        sort: 'user_code',
        order: 'asc',
        filter: JSON.stringify([{ Key: 'obs_code', Val: changeValue, Operator: '=' }]),
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
      value={value}
      labelInValue={labelInValue}
      placeholder="所属单位名称"
      filterOption={(input, opt) => {
        // @ts-ignore
        return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
    >
      {obsList &&
        obsList.map((obsItem: any) => {
          return (
            <Option key={obsItem.obs_code} value={obsItem.obs_code}>
              {obsItem.obs_name}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect(({ common }: ConnectState) => ({
  obsList: common.obsList,
}))(ObsList);
