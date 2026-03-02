import { Input } from 'antd';
import React, {useEffect} from 'react';

const AddInput = ({onBlurSave, value, onChange}: any) => {
  const [showValue, setShowValue] = React.useState(value || '');

  useEffect(() => {
    setShowValue(value)
  }, [value]);

  return (
    <Input
      value={showValue}
      onBlur={onBlurSave}
      placeholder={'请输入'}
      onChange={(e) => {
        setShowValue(e.target.value);
        onChange(e)
      }}
    />
  )
}

export default AddInput;
