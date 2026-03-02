import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { queryWBS } from '@/services/user';

interface WbsSelectProps {
  branchCode?: string; // 接收父级传来的分公司编码
  value?: string;
  onChange?: (val: string) => void;
}

const WbsSelect = ({ branchCode, value, onChange, ...restProps }: WbsSelectProps) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWbsData = async () => {
      if (!branchCode) {
        setOptions([]);
        return;
      }
      
      setLoading(true);
      const res = await queryWBS({
        sort: 'wbs_code',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'prop_key', Val: 'dep', Operator: '=' },
          { Key: 'up_wbs_code', Val: branchCode, Operator: '=' }
        ])
      });

      if (res?.rows) {
        const wbsOptions = res.rows.map((item: any) => ({
          value: item.wbs_code,
          label: item.wbs_name,
        }));
        setOptions(wbsOptions);

        // 自动选中逻辑：如果只有一项，且当前没有值或者当前值不在新选项里
        if (wbsOptions.length === 1) {
          onChange?.(wbsOptions[0].value);
        }
      } else {
        setOptions([]);
      }
      setLoading(false);
    };

    fetchWbsData();
  }, [branchCode]); // 核心：监听 branchCode 变化

  return (
    <Select
      placeholder={branchCode ? "请选择项目部" : "请先选择分公司"}
      options={options}
      value={value}
      onChange={onChange}
      loading={loading}
      disabled={!branchCode}
      allowClear
      {...restProps}
    />
  );
};


export default WbsSelect