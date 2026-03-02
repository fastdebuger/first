import React from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';

// 独立的时间选择组件,计量器具管理模块用
const DateSelfToolbar: React.FC<any> = (props) => {
  /**
 * 从props中解构获取年份、月份
 * 
 * @property {number} defaultYear - 默认年份值
 * @property {number} defaultMonth - 默认月份值  
 * @property {Function} setDefaultYear - 设置默认年份的函数
 * @property {Function} setDefaultMonth - 设置默认月份的函数
 */
  const {
    defaultYear,
    defaultMonth,
    setDefaultYear,
    setDefaultMonth,
    showYear = true,
    showMonth = true
  } = props;
  // 选择年份选择器
  const handleChangeYear = (_date: any, dateString: any) => {
    console.log(dateString, "dateString");
    setDefaultYear(dateString);
  }
  
  // 月份选择器
  const handleChangeMonth = (_date: any, dateString: any) => {
    console.log(dateString, "dateString");
    setDefaultMonth(dateString);
  }

  return (
    <Space>
      {showYear && (
        <DatePicker 
          allowClear={false}
          value={moment(defaultYear, 'YYYY')} 
          onChange={handleChangeYear} 
          picker="year" 
        />
      )}
      {showMonth && (
        <DatePicker 
          allowClear={false}
          value={defaultMonth ? moment(defaultMonth, 'MM') : null} 
          onChange={handleChangeMonth} 
          picker="month" 
          format='MM' 
        />
      )}
    </Space>
  );
};

export default DateSelfToolbar;