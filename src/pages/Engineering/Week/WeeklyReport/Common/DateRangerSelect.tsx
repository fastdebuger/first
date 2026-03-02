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

  // 1）初始化：默认用「上周四 ~ 本周三」
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
 * 返回 [上周四 00:00:00, 本周三 23:59:59.999] 的 moment 数组
 */
export function getLastThuToThisWedRange(): [Moment, Moment] {
  // 本周三
  const thisWed = moment().isoWeekday(3).endOf('day'); // 1=周一, 3=周三

  // 上周四
  const lastThu = moment()
    .subtract(1, 'week') // 上一周
    .isoWeekday(4)       // 4=周四
    .startOf('day');

  return [lastThu, thisWed];
}

/**
 * 返回 [上上周四 00:00:00, 上周三 23:59:59.999] 的 moment 数组
 */
export function getLastLastThuToLastWedRange(): [moment.Moment, moment.Moment] {
  // 上周三（原逻辑的“本周三”减 1 周）
  const lastWed = moment()
    .subtract(1, 'week') // 基准从“本周”改为“上周”
    .isoWeekday(3)       // 3=周三
    .endOf('day');       // 23:59:59.999

  // 上上周四（原逻辑的“上周四”减 1 周，或直接减 2 周的周四）
  const lastLastThu = moment()
    .subtract(2, 'week') // 基准从“上周”改为“上上周”
    .isoWeekday(4)       // 4=周四
    .startOf('day');     // 00:00:00

  return [lastLastThu, lastWed];
}

export default DateRangerSelect;
