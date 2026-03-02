import { InputNumber } from 'antd';
import React, {useEffect} from 'react';

const AddInputNumber = ({disabled = false, value, onChange, max = undefined}: any) => {
  const [showValue, setShowValue] = React.useState(value || 0);

  useEffect(() => {
    setShowValue(value)
  }, [value]);

  return (
    <InputNumber
      value={showValue}
      disabled={disabled}
      min={0}
      max={max}
      placeholder={'请输入'}
      onChange={(_value) => {
        setShowValue(value);
        onChange(_value)
      }}
    />
  )
}

export default AddInputNumber;
