import { Select } from 'antd';
import React, { useEffect, useState, useRef } from 'react';

const { Option } = Select;

/**
 * 风险类别详情
 */
interface RiskDetailItem {
  id: string | number;
  parent_id: string | number;
  category_name: string;
}

/**
 * 组件 Props 接口定义
 */
interface RiskCategoryDetailsSelectProps {
  record: any; // 表格当前行的数据对象
  handleSave: (record: any) => void; // 保存数据回传给表格的方法
  riskCategoryDetails: RiskDetailItem[]; // 所有的风险详情下拉数据源
}

const RiskCategoryDetailsSelect: React.FC<RiskCategoryDetailsSelectProps> = ({
  record,
  handleSave,
  riskCategoryDetails,
}) => {
  // 初始化状态：从 record 中获取已有的详情数据
  const [value, setValue] = useState<any[]>(record["risk_category_details"] || []);

  // 是否首次执行
  const isFirstRender = useRef(true);

  /**
   * 监听父级“风险类别”的变化
   * 联动逻辑：当风险类别改变时，清空已选的详情内容
   */
  useEffect(() => {
    // 首次渲染辑
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 清空当前组件内部状态
    setValue([]);

    // 同步更新外部表格的数据源，保持 record 数据一致性
    const copyRecord = { ...record };
    copyRecord.risk_category_details = [];
    handleSave(copyRecord);

  }, [record.risk_category]);

  /**
   * Select 变化时的回调
   * @param val 当前选中的所有 ID 数组
   */
  const handleChange = (val: any[]) => {
    const selectedValue = val || [];

    // 更新本地 UI 状态
    setValue(selectedValue);

    // 将变更后的数据保存至表格行记录
    const copyRecord = { ...record };
    copyRecord.risk_category_details = selectedValue;
    handleSave(copyRecord);
  };

  return (
    <Select
      value={value}
      mode="multiple"
      allowClear
      style={{ width: '100%' }}
      disabled={!record.risk_category}
      placeholder={record.risk_category ? "请选择二级风险名称" : "请先选择一级风险名称"}
      onChange={handleChange}
      optionFilterProp="children"
    >
      {/* 数据过滤逻辑：
          1. 确保数据源存在
          2. 过滤出 parent_id 等于当前行 risk_category 的子项
      */}
      {riskCategoryDetails
        ?.filter((item) => String(item.parent_id) === String(record.risk_category))
        .map((item) => (
          <Option key={item.id} value={item.id}>
            {item.category_name}
          </Option>
        ))}
    </Select>
  );
};

export default RiskCategoryDetailsSelect;