import React, { useState, useEffect } from 'react';
import { Segmented } from 'antd';


/**
 * 我的审批任务 Segmented 组件
 * 用于切换审批状态：全部、待我审批、我已审批
 * 质量管理中年审、复审使用的组件
 */
const ApprovalTaskSegmented: React.FC<any> = (props) => {
  const { value, onChange, options, ...restProps } = props;
  
  const handleChange = (newValue: string | number) => {
    if (onChange) {
      onChange(newValue);
    }
  };
  
  // 默认选项
  const defaultOptions = [
    { value: 'all', label: '全部' },
    { value: '0', label: '待我审批' },
    { value: '1', label: '我已审批' },
  ];
  
  
  return (
    <Segmented
      {...restProps}
      value={value}
      onChange={handleChange}
      options={defaultOptions || []}
    />
  );
};

export default ApprovalTaskSegmented;