import React, {useEffect, useState} from 'react';
import {DatePicker} from "antd";
import moment from "moment";
import {getDateTS, showMomentTS} from "@/utils/utils";

const FormItemIsDatePicker = (props: any) => {
  const { value, onChange, onSave, disabled = false, needValue = 'timestamp'} = props;

  const [dateValue, setDateValue] = useState<any>();

  useEffect(() => {
    if (value) {
      if (needValue === 'timestamp') {
        setDateValue(showMomentTS(Number(value)))
      } else if (needValue === 'date') {
        setDateValue(moment(value))
      }
    } else {
      setDateValue(null);
    }
  }, [value]);

  return (
    <DatePicker
      disabled={disabled}
      value={dateValue}
      style={{ width: "100%" }}
      placeholder={`请输入`}
      onChange={(date, dateString) => {
        if (date) {
          const dateTimestamp = moment(date).unix();
          if (needValue === 'timestamp') {
            onChange(getDateTS(dateTimestamp));
            if(onSave) onSave(getDateTS(dateTimestamp));
          } else if (needValue === 'date') {
            onChange(dateString);
            if(onSave) onSave(dateString);
          }
        } else {
          onChange(null);
        }
      }}
    />
  )
}

export default FormItemIsDatePicker;
