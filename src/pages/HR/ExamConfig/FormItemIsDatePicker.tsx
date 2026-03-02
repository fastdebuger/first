import {useEffect, useState} from 'react';
import {DatePicker} from "antd";
import moment from "moment";

const FormItemIsDatePicker = (props: any) => {
  const { value, onChange, disabled = false} = props;

  const [dateValue, setDateValue] = useState<any>();

  useEffect(() => {
    if (value) {
      setDateValue(moment.unix(Number(value)))
    } else {
      setDateValue(null);
    }
  }, [value]);

  return (
    <DatePicker
      value={dateValue}
      showTime
      disabled={disabled}
      style={{ width: '50%' }}
      placeholder={`请选择时间`}
      onChange={(date, dateString) => {
        if (date) {
          const dateTimestamp = moment(date).unix();
          onChange(dateTimestamp);
          setDateValue(date);
        } else {
          onChange(null);
        }
      }}
    />
  )
}

export default FormItemIsDatePicker;
