import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React from 'react';
import { ErrorCode } from '@/common/const';
import { decrypt, encrypt, getUuid, TOKENCRYPTOJSKEY } from '@/utils/request';

interface UploadSingleButtonPropI {
  onChange: (file: any) => void;
  accept?: string;
  limitSize?: number;
}

const UploadSingleButton: React.FC<UploadSingleButtonPropI> = (props) => {
  const {
    onChange,
    accept = '.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf',
    limitSize = 2,
    children,
  } = props;

  let cToken = localStorage.getItem('x-auth-token');

  if (cToken) {
    cToken = encrypt(
      JSON.stringify({ token: JSON.parse(decrypt(cToken)).jwtToken, uuid: getUuid() }),
      TOKENCRYPTOJSKEY,
    );
  }

  /**
   * 判断上传的文件是否满足文件格式
   * @param name
   */
  const isFormatFileType = (name: string) => {
    let flag = false;
    const filtTypeArr = accept.split(',');
    for (let i = 0; i < filtTypeArr.length; i += 1) {
      if (name.includes(filtTypeArr[i])) {
        flag = true;
        break;
      }
    }
    return flag;
  };
  const upLoadProps: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept,
    action: '/file/aut/upLoad',
    headers: {
      ctoken: cToken || '',
    },
    beforeUpload: (file: any) => {
      const isFormatFile = isFormatFileType(file.name);
      const isLt2M = file.size < limitSize * 1024 * 1024;
      if (!isFormatFile) {
        message.error('文件格式不对');
      }
      if (!isLt2M) {
        message.error('文件不能超过2MB!');
      }
      return isFormatFile && isLt2M;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.errCode === ErrorCode.ErrOk) {
          onChange(info.file);
          // message.success(`${info.file.name} file uploaded successfully`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <Upload {...upLoadProps}>
      {children || <Button icon={<UploadOutlined />}>上传文件</Button>}
    </Upload>
  );
};

export default UploadSingleButton;
