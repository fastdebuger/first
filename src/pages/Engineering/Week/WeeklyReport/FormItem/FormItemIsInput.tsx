import React, {useEffect} from 'react';
import {Input} from "antd";

const FormItemIsInput = (props: any) => {
  const { value, onChange, item} = props;

  return (
    <Input
      // disabled={item.disabled}
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      placeholder={`请输入${item.name}`}
    />
  )
}

export default FormItemIsInput;
