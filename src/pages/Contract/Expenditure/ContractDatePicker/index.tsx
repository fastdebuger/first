import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import type { RangePickerProps } from 'antd/es/date-picker';

interface ContractDatePickerProps {
  /** 限制的起始时间 (秒级时间戳) */
  startDateLimit?: string | number | null;
  /** 限制的结束时间 (秒级时间戳) */
  endDateLimit?: string | number | null;
  value?: any;
  onChange?: (value: any) => void;
  style?: React.CSSProperties;
  placeholder?: string;
}

const ContractDatePicker: React.FC<ContractDatePickerProps> = ({ 
  startDateLimit, 
  endDateLimit, 
  value, 
  onChange, 
  style,
  placeholder = "请选择日期"
}) => {
  
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    if (!current) return false;

    let isBeforeStart = false;
    let isAfterEnd = false;

    // 只要有起始值，就禁用之前的
    if (startDateLimit) {
      const start = moment(Number(startDateLimit) * 1000).startOf('day');
      isBeforeStart = current.isBefore(start, 'day');
    }

    // 只要有结束值，就禁用之后的
    if (endDateLimit) {
      const end = moment(Number(endDateLimit) * 1000).startOf('day');
      isAfterEnd = current.isAfter(end, 'day');
    }

    // 如果两个都是 null，这里会返回 false || false，即全部可选
    return isBeforeStart || isAfterEnd;
  };

  return (
    <DatePicker
      style={{ width: '100%', ...style }}
      value={value}
      onChange={onChange}
      disabledDate={disabledDate}
      placeholder={placeholder}
    />
  );
};

export default ContractDatePicker;