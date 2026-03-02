import React from 'react';
import { Button, Modal, Space } from 'antd';
import { VIDEOTYPE } from '@/common/const';
import VideoPlayer from './VideoPlayer';
import ViewPdf from './ViewPdf';
import ViewFiles from './ViewFiles';

/**
 * 查看文件的弹窗
 * @param props
 * @constructor
 */
const FilesViewModal: React.FC<any> = (props: any) => {
  const { visible, onCancel, url, title } = props;

  const getFilterUrlSuffix = (fileUrl: string) => {
    if (!fileUrl) {
      return '';
    }
    return fileUrl.slice(fileUrl.lastIndexOf('.'));
  };

  return (
    <Modal
      title={title || '课程查看'}
      visible={visible}
      onCancel={onCancel}
      // okText={'下载'}
      closable={false}
      footer={null}
      // onOk={() => window.open(url)}
      width={'100vw'}
      style={{
        top: 0,
        maxWidth: '100vw',
        paddingBottom: 0,
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
      bodyStyle={{
        height: 'calc(100vh - 55px)',
        overflow: 'auto'
      }}
    >
      {
        //视频
        VIDEOTYPE.includes(getFilterUrlSuffix(url) as string) && <VideoPlayer url={url} />
      }
      {
        //pdf文件
        getFilterUrlSuffix(url).includes('pdf') && <ViewPdf pdfUrl={url} />
      }
      {!VIDEOTYPE.includes(getFilterUrlSuffix(url) as string) && //不是视频
        !url.includes('pdf') && ( //不是pdf
          <ViewFiles url={url} />
        )}

      <Space style={{
        top: 10,
        right: 10,
        position: "absolute"
      }}>
        <Button type='primary' onClick={() => window.open(url)}>
          下载
        </Button>
        <Button onClick={onCancel}>
          取消
        </Button>
      </Space>

    </Modal>
  );
};

export default FilesViewModal;
