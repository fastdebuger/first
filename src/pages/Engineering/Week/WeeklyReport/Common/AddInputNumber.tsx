import { InputNumber } from 'antd';
import React, {useEffect} from 'react';

const AddInputNumber = ({disabled = false, onBlurSave, value, onChange, max = undefined}: any) => {
  const [showValue, setShowValue] = React.useState(value || 0);

  useEffect(() => {
    setShowValue(value)
  }, [value]);

  return (
    <InputNumber
      value={showValue}
      min={0}
      disabled={disabled}
      max={max}
      onBlur={onBlurSave}
      style={{width: '100%'}}
      placeholder={'请输入1'}
      onChange={(_value) => {
        setShowValue(value);
        onChange(_value)
      }}
    />
  )
}

export default AddInputNumber;
