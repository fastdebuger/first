import { queryWBS } from '@/services/user';
import { useState, useEffect } from 'react';

interface WbsOption {
  value: string;
  name: string;
}

/**
 * WBS 级联数据获取
 * @param form Ant Design 的 form 实例
 * @param branchCompCode 当前选中的分公司代码
 */
export const useWbsCascader = (form: any, branchCompCode?: string) => {
  const [branchCompOptions, setBranchCompOptions] = useState<WbsOption[]>([]);
  const [wbsOptions, setWbsOptions] = useState<WbsOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. 获取分公司初始数据
  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        setLoading(true);
        const res = await queryWBS({
          sort: 'wbs_code',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'prop_key', Val: 'subComp', Operator: '=' }
          ])
        });

        if (res?.rows) {
          const options = res.rows.map((item: any) => ({ value: item.wbs_code, name: item.wbs_name }));
          setBranchCompOptions(options);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [form]);

  // 2. 根据分公司联动获取项目部数据
  useEffect(() => {
    const fetchWbsData = async () => {
      if (!branchCompCode) {
        setWbsOptions([]);
        // 记得清空下级表单值
        form.setFieldsValue({ wbs_code: undefined });
        return;
      }

      try {
        setLoading(true);
        const res = await queryWBS({
          sort: 'wbs_code',
          order: 'asc',
          filter: JSON.stringify([
            // { Key: 'prop_key', Val: 'dep', Operator: '=' },
            { Key: 'up_wbs_code', Val: branchCompCode, Operator: '=' }
          ])
        });

        if (res?.rows) {
          const options = res.rows.map((item: any) => ({ value: item.wbs_code, name: item.wbs_name }));
          setWbsOptions(options);

        } else {
          setWbsOptions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWbsData();
  }, [branchCompCode]);

  return {
    branchCompOptions,
    wbsOptions,
    loading
  };
};
