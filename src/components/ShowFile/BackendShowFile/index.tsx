import React, {useEffect, useState} from 'react';
import {Button, message} from 'antd';
import {downloadFileFormCloud} from "@/services/user";
import {ErrorCode} from "@/common/const";

const BackendShowFile = (props: any) => {
  const {text} = props;
  const [loading, setLoading] = useState<boolean>(false);

  const downloadFile = async (text: string) => {
    if (!text) {
      message.warn('暂无文件')
    } else if (!text.includes('http')) {
      message.warn('上传文件格式有误')
    } else {
      setLoading(true)
      const res = await downloadFileFormCloud({
        fileUrl: text
      })
      if (res && res.errCode === ErrorCode.ErrOk) {
        window.open(res.fileUrl)
      }
      setLoading(false)
    }
  }


  return (
    <>
      {text ?
        <Button loading={loading} type={"link"} onClick={() => {
          downloadFile(text)
        }}>
          查看文件
        </Button> : ''
      }
    </>
  )
}

export default BackendShowFile;
