import React from 'react'
import { Button, message } from 'antd';
import { batchDownload } from '@/services/upload';

interface IBetchDownLoadButtonProps {
  file_path: string,//需要上传的文件
  text?: string,//按钮名称
}

/**
 * 批量下载
 * @param props
 * @returns
 */
const BetchDownLoadButton = (props: IBetchDownLoadButtonProps) => {
  const { file_path ,text="扫描件批量下载"} = props
  const onClickHandle = async () => {

    if (!file_path) {
      message.warning('请选择包含附件的文件进行下载！');
      return;
    }
    message.loading({ content: '文件打包中，请稍候...', key: 'batchDownload' });
    try {
      await batchDownload({
        file_path
      })
        .then(response => {
          window.open(response?.result)
        });
      message.success({ content: '批量下载请求成功，请查看下载列表', key: 'batchDownload', duration: 3 });
    } catch (error) {
      message.error({ content: '批量下载失败！', key: 'batchDownload', duration: 3 });
      console.error('批量下载错误:', error);
    }
  }
  return (
    <Button
      type="primary"
      onClick={onClickHandle}
    >
      {text}
    </Button>
  )
}

export default BetchDownLoadButton
