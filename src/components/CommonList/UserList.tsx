import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import { connect } from 'umi';

const { Option } = Select;

let userListTimer: any;
const UserList: React.FC<any> = (props) => {
  const { dispatch, onChange, labelInValue = false, size, style = {}, disabled = false } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'common/querySubWbsUser',
      payload: {
        prop_key: 'dep',
        isCurrWbsUsr: 'Y',
        sort: 'user_code',
        order: 'asc',
        offset: 1,
        limit: 10,
        wbs_code: localStorage.getItem('auth-default-wbsCode'),
      },
      callback(res: any) {
        if (res && res.rows && res.rows.length > 0) {
          setData(res.rows);
        } else {
          setData([]);
        }
      },
    });
  }, []);

  const handleChange = (_value: string | any) => {
    if (onChange) onChange(_value);
  };

  const getData = (val: any) => {
    setLoading(true);
    let filter = JSON.stringify([]);
    if (val) {
      filter = JSON.stringify([{ Key: 'all_user_info', Val: val }]);
      dispatch({
        type: 'common/querySubWbsUser',
        payload: {
          prop_key: 'dep',
          isCurrWbsUsr: 'Y',
          sort: 'user_code',
          order: 'asc',
          filter: filter,
          wbs_code: localStorage.getItem('auth-default-wbsCode'),
        },
        callback(res: any) {
          if (res && res.rows && res.rows.length > 0) {
            setData(res.rows);
          } else {
            setData([]);
          }
          setLoading(false);
        },
      });
    }
    setLoading(false);
  };

  const handleSearch = (value: any) => {
    if (userListTimer) {
      clearTimeout(userListTimer);
    }
    userListTimer = setTimeout(() => {
      getData(value);
    }, 300);
  };

  return (
    <Select
      style={style}
      size={size}
      onChange={handleChange}
      onSearch={handleSearch}
      labelInValue={labelInValue}
      placeholder="请输入用户名或用户编码进行搜索"
      showSearch
      allowClear
      notFoundContent={loading ? <Spin size="small" /> : null}
      filterOption={false}
      disabled={disabled}
    >
      {data &&
        data.map((item: any) => {
          return (
            <Option key={item.user_code} value={item.user_code}>
              {item.all_user_info}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect()(UserList);
