import React from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';

const { Option } = Select;

const ObsOutUserList: React.FC<any> = (props) => {
  const { value, outUserList, onChange, labelInValue = false } = props;
  const handleChange = (_value: string | any) => {
    if (onChange) onChange(_value);
  };
  return (
    <Select
      onChange={handleChange}
      allowClear
      value={value}
      labelInValue={labelInValue}
      placeholder="领料人名称"
    >
      {outUserList &&
        outUserList.map((userItem: any) => {
          return (
            <Option key={userItem.user_code} value={userItem.user_code}>
              {userItem.user_name}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect(({ common }: ConnectState) => ({
  outUserList: common.outUserList,
}))(ObsOutUserList);
