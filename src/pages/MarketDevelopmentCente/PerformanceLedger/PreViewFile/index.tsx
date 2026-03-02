import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Alert } from "antd";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { FileUnknownOutlined, WarningOutlined } from '@ant-design/icons';
import ViewPdf from './ViewPdf'; 
import styles from './index.module.css';

/**
 * 通用文件预览组件 - 业绩台账专用
 */
const PerformanceLedgerPage: React.FC<{ previewUrl?: string }> = ({ previewUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // 用于强制刷新iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 无文件链接时不渲染预览按钮
  if (!previewUrl) return null;

  // 常量定义区
  const OFFICE_EXT_LIST = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  const IMG_EXT_LIST = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  
  // 微软Office在线预览参数 - 强化禁用下载功能
  const MS_OFFICE_PREVIEW_URL = 'https://view.officeapps.live.com/op/embed.aspx?src=';
  const MS_OFFICE_PARAMS = '&wdDownloadButton=False&wdHideDownloadButton=True&AllowTyping=False&ui=zh-CN&wdHideHeaders=True&wdHideSheetTabs=True&simpleui=1';

  // 工具方法：获取文件后缀（过滤链接参数，统一转小写）
  const getFileExt = (url: string): string => {
    if (!url) return '';
    const pureUrl = url.split('?')[0];
    return pureUrl.split('.').pop()?.toLowerCase() || '';
  };

  // 工具方法：获取最终预览链接（按类型处理）
  const getRealPreviewUrl = (ext: string, rawUrl: string): string => {
    if (OFFICE_EXT_LIST.includes(ext)) {
      // 对Office文件进行特殊处理，确保禁用下载
      const encodedUrl = encodeURIComponent(getUrlCrypto(rawUrl));
      return `${MS_OFFICE_PREVIEW_URL}${encodedUrl}${MS_OFFICE_PARAMS}`;
    }
    return getUrlCrypto(rawUrl);
  };

  // 打开弹窗方法
  const showModal = () => {
    setIsModalOpen(true);
    setIframeKey(prev => prev + 1); // 每次打开都刷新iframe
  };

  // 关闭弹窗方法（统一收口，重置状态）
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 处理Office文件iframe加载完成
  const handleOfficeIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // 注入CSS样式隐藏下载区域
        const style = `
          <style>
            /* 隐藏微软Office在线预览的底部工具栏 */
            #ToolBar, 
            .OfficeOnlineBottomBar, 
            .WACStatusBar, 
            .WACCommandBar,
            [role="toolbar"],
            .PowerPointViewer_BottomBar,
            .ExcelViewer_BottomBar,
            .WordViewer_BottomBar,
            #CommandBar,
            #WACViewerCommandBar,
            #WACViewerContainer > div:last-child,
            div[aria-label="工具栏"],
            div[aria-label="命令栏"] {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              opacity: 0 !important;
            }
            
            /* 隐藏右键菜单 */
            body {
              -webkit-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
              user-select: none !important;
            }
            
            /* 防止拖拽 */
            img, a {
              -webkit-user-drag: none !important;
            }
          </style>
        `;
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc.head) {
          // 检查是否已经注入了样式
          if (!iframeDoc.getElementById('disable-download-style')) {
            const styleElement = iframeDoc.createElement('style');
            styleElement.id = 'disable-download-style';
            styleElement.innerHTML = style;
            iframeDoc.head.appendChild(styleElement);
          }
        }
      }
    } catch (error) {
      // 跨域限制，无法操作iframe内容
      console.log('无法注入样式到Office预览页面（跨域限制）');
    }
  };

  // 渲染不同类型的预览节点
  const renderPreviewNode = () => {
    const fileExt = getFileExt(previewUrl);
    const realPreviewUrl = getRealPreviewUrl(fileExt, previewUrl);

    // 加载/失败处理
    const onErrorHandler = (tips: string) => {
      message.error(tips);
      handleCancel();
    };

    switch (true) {
      case fileExt === 'pdf':
        return (
          <div className={styles.previewContainer}>
            <ViewPdf pdfUrl={realPreviewUrl} />
          </div>
        );
      
      case IMG_EXT_LIST.includes(fileExt):
        return (
          <div className={styles.imagePreviewContainer}>
            <img
              src={realPreviewUrl}
              alt="文件预览"
              className={styles.previewImage}
              onError={() => onErrorHandler('图片加载失败，请检查文件链接')}
            />
          </div>
        );
      
      case OFFICE_EXT_LIST.includes(fileExt):
        return (
          <div className={styles.officePreviewContainer}>
            <div className={styles.officeWarning}>
              <Alert
                message="预览提示"
                description={
                  <div>
                    <div>当前为只读预览模式，已禁用下载功能</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      如需编辑或下载，请联系文件管理员
                    </div>
                  </div>
                }
                type="info"
                showIcon
                icon={<WarningOutlined />}
                className={styles.warningAlert}
              />
            </div>
            
            {/* 使用key强制刷新iframe */}
            <iframe
              key={`office-preview-${iframeKey}`}
              ref={iframeRef}
              src={realPreviewUrl}
              className={styles.officeIframe}
              allowFullScreen
              onLoad={handleOfficeIframeLoad}
              onError={() => onErrorHandler('Office文件预览加载失败')}
              title="Office文件预览"
            />
            
            {/* 遮挡层 - 防止用户通过F12等工具访问iframe内容 */}
            <div className={styles.iframeOverlay}></div>
          </div>
        );
      
      default:
        return (
          <div className={styles.unsupportedContainer}>
            <FileUnknownOutlined className={styles.unsupportedIcon} />
            <p className={styles.unsupportedText}>该文件格式暂不支持在线预览</p>
          </div>
        );
    }
  };

  return (
    <>
      <Button onClick={showModal} size="small" type="link">
        预览文件
      </Button>
      <Modal
        title="文件预览"
        open={isModalOpen}
        onCancel={handleCancel}
        width="80%"
        className={styles.previewModal}
        bodyStyle={{ 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column',
          height: '70vh'
        }}
        footer={null}
        maskClosable={true}
        destroyOnClose={true}
      >
        <div
          className={styles.modalContent}
          onContextMenu={(e) => {
            e.preventDefault();
            message.warning('为保护文件安全，右键功能已禁用');
          }}
        >
          {/* 预览节点：按文件类型渲染对应标签 */}
          <div className={styles.previewContent}>
            {renderPreviewNode()}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PerformanceLedgerPage;