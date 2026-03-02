import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;

// 字符串日期类型
type DateStr = string; // '2025-12-01'
type DateRangeStr = [DateStr, DateStr];

const DateRangerSelect: React.FC = ({disabled = false, defaultRangeStr = [], onChange }: any) => {

  // 组件内部用“字符串日期”保存，方便直接传给后端
  const [rangeStr, setRangeStr] = useState<DateRangeStr | null>(null);

  // 1）初始化：默认用「上月四 ~ 本月三」
  useEffect(() => {
    setRangeStr(defaultRangeStr);
  }, []);

  // 2）把字符串转成 moment，给 RangePicker 回显
  const pickerValue: [Moment, Moment] | null = rangeStr
    ? [
      moment(rangeStr[0], 'YYYY-MM-DD'),
      moment(rangeStr[1], 'YYYY-MM-DD'),
    ]
    : null;

  // 3）RangePicker 修改时：把 moment 转回字符串存 state
  const handleChange = (dates: null | [Moment, Moment]) => {
    if (!dates) {
      setRangeStr(null);
      return;
    }
    const [start, end] = dates;
    setRangeStr([
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD'),
    ]);
    onChange([
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD'),
    ])
  };


  return (
    <div>
      <RangePicker
        disabled={disabled}
        value={pickerValue as any}
        onChange={handleChange}
        format="YYYY-MM-DD"
        allowClear
      />
    </div>
  );
};

/**
 * 返回 [上月四 00:00:00, 本月三 23:59:59.999] 的 moment 数组
 */
export function getLastThuToThisWedRange(): [Moment, Moment] {
  // 本月三
  const thisWed = moment().isoMonthday(3).endOf('day'); // 1=月一, 3=月三

  // 上月四
  const lastThu = moment()
    .subtract(1, 'month') // 上一月
    .isoMonthday(4)       // 4=月四
    .startOf('day');

  return [lastThu, thisWed];
}

/**
 * 返回 [上上月四 00:00:00, 上月三 23:59:59.999] 的 moment 数组
 */
export function getLastLastThuToLastWedRange(): [moment.Moment, moment.Moment] {
  // 上月三（原逻辑的“本月三”减 1 月）
  const lastWed = moment()
    .subtract(1, 'month') // 基准从“本月”改为“上月”
    .isoMonthday(3)       // 3=月三
    .endOf('day');       // 23:59:59.999

  // 上上月四（原逻辑的“上月四”减 1 月，或直接减 2 月的月四）
  const lastLastThu = moment()
    .subtract(2, 'month') // 基准从“上月”改为“上上月”
    .isoMonthday(4)       // 4=月四
    .startOf('day');     // 00:00:00

  return [lastLastThu, lastWed];
}

export default DateRangerSelect;
