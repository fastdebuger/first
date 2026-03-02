import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Select } from 'antd';
import type { ConnectState } from '@/models/connect';

const { Option } = Select;
const ProfessionList: React.FC<any> = (props: any) => {
  const {
    dispatch,
    professionList,
    onChange,
    labelInValue = false,
    style,
    disabled = false,
  } = props;
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'common/queryQualityProfession',
        payload: {
          sort: 'ProfessionCode',
          order: 'asc',
        },
      });
    }
  }, []);

  const handleChange = (val: any) => {
    if (dispatch) {
      dispatch({
        type: 'common/queryQualityProfessionDetails',
        payload: {
          sort: 'Id',
          order: 'asc',
          filter: JSON.stringify([{ Key: 'ProfessionCode', Val: val, Operator: '=' }]),
        },
      });
    }
    onChange(val);
  };
  return (
    <Select
      style={style}
      onChange={handleChange}
      showSearch
      allowClear
      disabled={disabled}
      labelInValue={labelInValue}
      placeholder="请选择专业"
      filterOption={(input, opt) => {
        // @ts-ignore
        return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
    >
      {professionList &&
        professionList.map((item: any) => {
          return (
            <Option key={item.ProfessionCode} value={item.ProfessionCode}>
              {item.ProfessionName}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect(({ common }: ConnectState) => ({
  professionList: common.professionList,
}))(ProfessionList);
