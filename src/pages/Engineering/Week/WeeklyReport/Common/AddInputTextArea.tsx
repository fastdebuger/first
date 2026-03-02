import { Input } from 'antd';
import React, {useEffect} from 'react';

const AddInputTextArea = ({value, onChange}: any) => {
  const [showValue, setShowValue] = React.useState(value || '');
  console.log('--textArea----value', value);
  useEffect(() => {
    setShowValue(value)
  }, [value]);

  return (
    <Input.TextArea
      value={showValue}
      placeholder={'请输入'}
      onChange={(e) => {
        setShowValue(e.target.value);
        onChange(e)
      }}
    />
  )
}

export default AddInputTextArea;
