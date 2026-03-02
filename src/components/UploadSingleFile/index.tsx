import React, { useState } from 'react';
import { message, Modal, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { ErrorCode } from '@/common/const';
import { decrypt, encrypt, getUuid, TOKENCRYPTOJSKEY } from '@/utils/request';

const { Dragger } = Upload;

const ShowUploadFile = (props: any) => {
  const { fileList, callBackRemove } = props;

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewOpen(false);

  const getBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as any);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const onRemove = (file: any) => {
    callBackRemove(file);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onRemove={onRemove}
        // onChange={handleChange}
      >
        {null}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

interface UploadSingleFilePropI {
  onChange: (file: any) => void;
  accept?: string;
  limitSize?: number;
  value?: any;
}

const UploadSingleFile: React.FC<UploadSingleFilePropI> = (props) => {
  const {
    onChange,
    accept = '.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf',
    limitSize = 2,
    value = null,
  } = props;

  let cToken = localStorage.getItem('x-auth-token');

  if (cToken) {
    cToken = encrypt(
      JSON.stringify({ token: JSON.parse(decrypt(cToken)).jwtToken, uuid: getUuid() }),
      TOKENCRYPTOJSKEY,
    );
  }

  const [fileList, setFileList] = useState<any[]>(value ? [{ url: value }] : []);

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
  const uploadProps = {
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
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if (info.file.response.errCode === ErrorCode.ErrOk) {
          setFileList([info.file]);
          onChange(info.file);
        }
        // message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      setFileList(e.dataTransfer.files);
    },
    onRemove() {
      return true;
    },
  };
  return (
    <span>
      {fileList.length > 0 ? (
        <ShowUploadFile
          fileList={fileList}
          callBackRemove={() => {
            setFileList([]);
          }}
        />
      ) : (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            将文件拖到此处&nbsp;&nbsp;&nbsp;&nbsp;或 <a>点击上传</a>
          </p>
          <p className="ant-upload-hint">
            每次只能上传1个文件, 大小不能超过{limitSize}MB、 目前支持上传的文件后缀为：{accept}
          </p>
        </Dragger>
      )}
    </span>
  );
};

export default UploadSingleFile;
