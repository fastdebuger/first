import React from 'react';
import {InputNumber} from "antd";

const FormItemIsInputNumber = (props: any) => {
  const { value, onChange, item} = props;
  return (
    <InputNumber
      value={value}
      style={{ width: "100%" }}
      placeholder={`请输入${item.name}`}
      onChange={onChange}
    />
  )
}

export default FormItemIsInputNumber;
