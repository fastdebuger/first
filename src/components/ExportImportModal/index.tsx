import React, { useState } from 'react';
import { Col, message, Modal, Row, Upload, Button, Space, Alert } from 'antd';
import { CloudDownloadOutlined, InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

interface ExportImportModalPropI {
  /** 文件格式 '.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf' */
  accept?: string;
  /** 最大上传数量 默认为1 */
  maxCount?: number;
  /** 文件大小  2 * 1024 * 1024 */
  limitSize?: number;
  /** 是否显示该弹窗 */
  visible: boolean;
  /** 弹窗消失方法 */
  onCancel: () => void;
  /** 点击开始导入方法，file 表示要上传的文件 返回 Promise<boolean> 返回resolve(true) 按钮的loading效果消失 */
  startUploadFile: (file: any) => Promise<boolean>;
  /** 点击下载模版的事件 */
  downLoadTemplate: () => void;
  /** 导出提示 */
  downloadTitle: string;
  /** 操作提示 */
  alertMessage: string;
}

const ExportImportModal: React.FC<ExportImportModalPropI> = (props) => {
  const {
    visible,
    onCancel,
    startUploadFile,
    downLoadTemplate,
    accept = '.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf',
    limitSize = 2 * 1024 * 1024,
    maxCount = 1,
    downloadTitle = '下载数据模版',
    alertMessage = '需要先下载模版后, 在模版内完善数据后，再导入下载的模版',
  } = props;

  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(true);
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
    maxCount,
    accept,
    fileList,
    beforeUpload: (file: any) => {
      const isFormatFile = isFormatFileType(file.name);
      const isLt2M = file.size < limitSize;
      if (!isFormatFile) {
        setShowUploadButton(true);
        message.error('文件格式不对');
        return true;
      }
      if (!isLt2M) {
        setShowUploadButton(true);
        message.error(`文件不能超过${limitSize}MB!`);
        return true;
      }
      setFileList([file]);
      setShowUploadButton(false);
      return false;
    },
    // 如果需要外部按钮 控制上传事件的话 此处不会有上传直接掉用接口的逻辑
    // 所以 要在beforeUpload  直接return false 并且onChange 事件 监听不到文件的上传状态status
    // onChange(info: any) {
    //   const { status } = info.file;
    //   if (status !== 'uploading') {
    //     // console.log(info.file, info.fileList);
    //   }
    //   if (status === 'done') {
    //     setShowUploadButton(false);
    //     // message.success(`${info.file.name} file uploaded successfully.`);
    //   } else if (status === 'error') {
    //     setShowUploadButton(true);
    //     // message.error(`${info.file.name} file upload failed.`);
    //   }
    // },
    onDrop() {
      // console.log('Dropped files', e.dataTransfer.files);
      // setFileList(e.dataTransfer.files);
    },
    onRemove(file: any) {
      setShowUploadButton(true);
      console.log('onRemove files', file);
      setFileList([]);
      return true;
    },
  };

  /**
   * 开始导入文件
   */
  const startUpload = async () => {
    const file = fileList[0];
    const isFormatFile = isFormatFileType(file.name);
    const isLt2M = file.size < limitSize;
    if (!isFormatFile) {
      setShowUploadButton(true);
      message.error('文件格式不对');
      return;
    }
    if (!isLt2M) {
      setShowUploadButton(true);
      message.error('文件不能超过2MB!');
      return;
    }
    setUploading(true);
    const res = await startUploadFile(file);
    if (res) {
      setUploading(false);
    }
  };

  return (
    <Modal
      style={{
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      }}
      bodyStyle={{
        height: 'calc(100vh - 65px)',
        overflowY: 'auto',
      }}
      title={
        <Row justify={'space-between'}>
          <Col>
            <h3>导入数据</h3>
          </Col>
          <Col>
            <Space>
              <Button
                loading={uploading}
                disabled={showUploadButton}
                onClick={() => startUpload()}
                type={'primary'}
              >
                开始导入
              </Button>
              <Button onClick={onCancel}>取消</Button>
            </Space>
          </Col>
        </Row>
      }
      width="100vw"
      footer={null}
      closable={false}
      visible={visible}
      onCancel={onCancel}
    >
      <Alert message={alertMessage} />
      <Row gutter={20} style={{ marginTop: 16 }}>
        <Col>
          <Button
            onClick={downLoadTemplate}
            style={{
              height: 180,
              width: 180,
            }}
          >
            <p className="ant-upload-drag-icon">
              <CloudDownloadOutlined style={{ fontSize: 48, color: '#40a9ff' }} />
            </p>
            <p>
              <span style={{ fontSize: 16, color: '#1890ff' }}>{downloadTitle}</span>
            </p>
          </Button>
        </Col>
        <Col>
          <div style={{ height: 180, width: 460 }}>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                将文件拖到此处&nbsp;&nbsp;&nbsp;&nbsp;或 <a>点击上传</a>
              </p>
              <p className="ant-upload-hint">
                每次只能上传{maxCount}个文件, 大小不能超过{(limitSize / 1024 / 1024).toFixed(2)}MB、
                目前支持上传的文件后缀为：{accept}
              </p>
            </Dragger>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default ExportImportModal;
