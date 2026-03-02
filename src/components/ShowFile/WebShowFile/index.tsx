import React, {useEffect, useState} from 'react';
import {Button} from 'antd';

const WebShowFile: React.FC<any>  = (props: any) => {
  const {text} = props;
  const [showText, setShowText] = useState(text);

  useEffect(() => {
    setShowText(text)
  }, [text])

  if (!showText) {
    return ''
  }
  if (!showText.includes('http')) {
    return ''
  }

  // 未加上水印的图片
  return (
    <>
      <Button type={"link"} onClick={() => {
        window.open(showText)
      }}>
        查看
      </Button>
    </>
  )
}

export default WebShowFile;
