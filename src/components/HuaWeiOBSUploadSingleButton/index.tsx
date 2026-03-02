import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React from 'react';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { decrypt, encrypt, getUuid, TOKENCRYPTOJSKEY } from '@/utils/request';
// @ts-ignore
import ObsClient from 'esdk-obs-browserjs';

interface UploadSingleButtonPropI {
  onChange: (file: any) => void;
  sysPath: string;
  accept?: string;
  limitSize?: number;
  folderPath?: string; // 文件所在文件夹目录
}

const HuaWeiOBSUploadSingleButton: React.FC<UploadSingleButtonPropI> = (props) => {
  const {
    onChange,
    accept = '.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf',
    limitSize = 2,
    children,
    sysPath = '',
    folderPath = '',
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
  /**
   * 自定义请求方法
   * @param fields
   */
  const customRequest = (fields: any) => {
    const currWbsCode = localStorage.getItem('auth-default-currWbsCode');
    const obsClient = new ObsClient({
      access_key_id: HUA_WEI_OBS_CONFIG.ACCESS_KEY_ID, // 配置AK
      secret_access_key: HUA_WEI_OBS_CONFIG.SECRET_ACCESS_KEY, // 配置SK
      server: HUA_WEI_OBS_CONFIG.SERVER, // 配置服务地址
      max_retry_count: 1,
      timeout: 2000,
      ssl_verify: false,
      long_conn_param: 0,
    });
    const fileKey = `${sysPath}/${currWbsCode}${
      folderPath ? (folderPath[0] !== '/' ? `/${folderPath}` : folderPath) : ''
    }/${fields.file.name}`;
    obsClient.putObject(
      {
        Bucket: HUA_WEI_OBS_CONFIG.BUCKET, // // 桶名称 建议用域名 可以区分不同公司
        Key: fileKey, // 桶内对象文件存储地址 文件夹名称+上传文件名
        // SourceFile: info.file,
        Body: fields.file,
        // Policy: res.Policy, // 策略
        // Signature: res.Signature, //签名
        // expires
      },
      (
        err: string,
        result: {
          CommonMsg: { Status: number; Code: string; Message: string };
          InterfaceResult: {
            RequestId: string;
            ETag: string;
            VersionId: string;
            StorageClass: string;
          };
        },
      ) => {
        if (err) {
          console.error('Error-->' + err);
          fields.onError();
        } else {
          console.log('---------result', result);
          if (result.CommonMsg.Status === 200) {
            fields.onSuccess({
              errCode: 0,
              url: HUA_WEI_OBS_CONFIG.HOST_URL + fileKey,
            });
          } else {
            fields.onError();
          }
          // if (result.CommonMsg.Status < 300) {
          //     console.log('RequestId-->' + result.InterfaceResult.RequestId);
          //     console.log('ETag-->' + result.InterfaceResult.ETag);
          //     console.log('VersionId-->' + result.InterfaceResult.VersionId);
          //     console.log('StorageClass-->' + result.InterfaceResult.StorageClass);
          // } else {
          //     console.log('Code-->' + result.CommonMsg.Code);
          //     console.log('Message-->' + result.CommonMsg.Message);
          // }
        }
      },
    );
  };
  const upLoadProps: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept,
    // action: "/file/aut/upLoad",
    // headers: {
    //   ctoken: cToken || '',
    // },
    customRequest,
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

export default HuaWeiOBSUploadSingleButton;
