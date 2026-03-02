import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { queryWBS } from '@/services/user';

const BranchSelect = ({ value, onChange, ...restProps }: any) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchBranchData = async () => {
      const res = await queryWBS({
        sort: 'wbs_code',
        order: 'asc',
        filter: JSON.stringify([{ Key: 'prop_key', Val: 'subComp', Operator: '=' }])
      });
      if (res?.rows) {
        const branchOptions = res.rows.map((item: any) => ({
          value: item.wbs_code,
          label: item.wbs_name,
        }));
        setOptions(branchOptions);
      }
    };
    fetchBranchData();
  }, []);

  return (
    <Select
      placeholder="请选择分公司"
      options={options}
      value={value}
      onChange={onChange}
      allowClear
      {...restProps}
    />
  );
};

export default BranchSelect