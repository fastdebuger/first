import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Spin, message, Result, Button, Alert, Empty, Space, Typography } from 'antd';
import { FilePdfOutlined, WarningOutlined } from '@ant-design/icons';
import styles from './index.module.css';

interface PdfPreviewProps {
  pdfUrl: string;
  scale?: number;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const { Text } = Typography;

const ViewPdf: React.FC<PdfPreviewProps> = ({ pdfUrl, scale = 1.5 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const pdfInstanceRef = useRef<any>(null);
  const isPdfjsLoadedRef = useRef<boolean>(false);

  // 清理资源
  const cleanup = useCallback(() => {
    if (pdfInstanceRef.current) {
      try {
        pdfInstanceRef.current.destroy();
      } catch (e) {
        console.warn('PDF实例销毁失败:', e);
      }
      pdfInstanceRef.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    isPdfjsLoadedRef.current = false;
  }, []);

  // 初始化PDF查看器
  const initPdfViewer = useCallback(() => {
    // 如果已经加载，直接返回
    if (isPdfjsLoadedRef.current && window.pdfjsLib) {
      if (pdfUrl) {
        loadPDF();
      }
      return;
    }

    // 使用固定版本的CDN
    const PDF_VERSION = '2.14.305';

    // 检查是否已加载
    if (window.pdfjsLib) {
      isPdfjsLoadedRef.current = true;
      if (pdfUrl) {
        loadPDF();
      }
      return;
    }

    // 加载PDF.js
    const script = document.createElement('script');
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_VERSION}/pdf.min.js`;
    script.async = true;

    script.onload = () => {
      console.log('PDF.js加载成功');
      // 配置worker
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_VERSION}/pdf.worker.min.js`;

      isPdfjsLoadedRef.current = true;

      if (pdfUrl) {
        loadPDF();
      } else {
        setLoading(false);
      }
    };

    script.onerror = () => {
      console.error('PDF.js加载失败');
      setLoading(false);
      setError('PDF查看器加载失败，请检查网络连接');
      message.error('PDF查看器加载失败');
    };

    document.head.appendChild(script);

    // 清理函数：组件卸载时移除script
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [pdfUrl]);

  // 处理PDF URL
  const processPdfUrl = useCallback((url: string): string => {
    if (!url) return url;

    try {
      // 检查是否是有效的URL
      const parsedUrl = new URL(url);

      // 如果是华为OBS URL，添加预览参数
      if (parsedUrl.hostname.includes('myhuaweicloud.com') || parsedUrl.hostname.includes('obs.')) {
        if (!parsedUrl.searchParams.has('response-content-disposition')) {
          parsedUrl.searchParams.set('response-content-type', 'application/pdf');
          parsedUrl.searchParams.set('response-content-disposition', 'inline');
        }
        return parsedUrl.toString();
      }

      return url;
    } catch (e) {
      // 如果不是有效的URL，直接返回
      return url;
    }
  }, []);

  // 渲染单页PDF
  const renderPage = useCallback(async (pdf: any, pageNum: number) => {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // 创建页面容器
      const pageContainer = document.createElement('div');
      pageContainer.className = styles.pdfPageContainer;
      pageContainer.style.width = `${viewport.width}px`;
      pageContainer.style.height = `${viewport.height}px`;

      // 创建canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('无法创建画布上下文');
      }

      // 设置canvas尺寸
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.className = styles.pdfCanvas;

      // 渲染PDF页面到canvas
      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      pageContainer.appendChild(canvas);

      // 添加页码
      // const pageNumberDiv = document.createElement('div');
      // pageNumberDiv.className = styles.pageNumber;
      // pageNumberDiv.textContent = `第 ${pageNum} 页`;
      // pageContainer.appendChild(pageNumberDiv);

      // 添加到容器
      if (containerRef.current) {
        containerRef.current.appendChild(pageContainer);
      }
    } catch (error) {
      console.error(`第${pageNum}页渲染失败:`, error);
      message.warning(`第${pageNum}页渲染失败，已跳过`);
    }
  }, [scale]);

  // 加载PDF文件
  const loadPDF = useCallback(async () => {
    if (!pdfUrl || !isPdfjsLoadedRef.current) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      cleanup();

      // 处理PDF URL
      const previewUrl = processPdfUrl(pdfUrl);

      // 加载PDF文档
      const loadingTask = window.pdfjsLib.getDocument({
        url: previewUrl,
        withCredentials: false,
      });

      const pdf = await loadingTask.promise;
      pdfInstanceRef.current = pdf;

      // 渲染所有页面
      const renderPromises = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        renderPromises.push(renderPage(pdf, i));
      }

      await Promise.all(renderPromises);

      setLoading(false);
      message.success(`PDF加载完成，共${pdf.numPages}页`);
    } catch (error) {
      console.error('PDF加载错误:', error);
      setLoading(false);

      const err = error as Error;
      let errorMsg = 'PDF加载失败';

      if (err.message.includes('version')) {
        errorMsg = 'PDF查看器版本不匹配，请刷新页面重试';
      } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        errorMsg = '网络错误，请检查文件地址和网络连接';
      } else {
        errorMsg = `加载失败: ${err.message}`;
      }

      setError(errorMsg);
      message.error(errorMsg);
    }
  }, [pdfUrl, cleanup, processPdfUrl, renderPage]);

  // 重新加载
  const handleRetry = useCallback(() => {
    // 清理现有的pdfjs库
    const scripts = document.querySelectorAll('script[src*="pdf.js"]');
    scripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });

    // 重置状态
    isPdfjsLoadedRef.current = false;
    setLoading(true);
    setError('');

    // 重新加载
    setTimeout(() => {
      initPdfViewer();
    }, 100);
  }, [initPdfViewer]);

  // 组件挂载和更新时执行
  useEffect(() => {
    initPdfViewer();

    return () => {
      cleanup();
    };
  }, [initPdfViewer, cleanup]);

  // PDF URL变化时重新加载
  useEffect(() => {
    if (pdfUrl && isPdfjsLoadedRef.current) {
      loadPDF();
    }
  }, [pdfUrl, loadPDF]);

  // 如果没有PDF URL
  if (!pdfUrl) {
    return (
      <div className={styles.emptyContainer}>
        <Empty
          image={<FilePdfOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
          description="暂无PDF文件链接"
        />
      </div>
    );
  }

  // 如果发生错误
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Result
          status="error"
          title="PDF加载失败"
          subTitle={error}
          extra={[
            <Alert
              style={{
                width: 1000
              }}
              key="tips"
              type="info"
              message={
                <Space direction="vertical" size={4}>
                  <Text strong>建议：</Text>
                  <Text>1. 检查PDF文件地址是否正确</Text>
                  <Text>2. 检查网络连接是否正常</Text>
                  <Text>3. 尝试清除浏览器缓存后重试</Text>
                </Space>
              }
              showIcon
              icon={<WarningOutlined />}
              className={styles.tipsAlert}
            />,
            <Button
              key="retry"
              type="link"
              onClick={handleRetry}
              size="small"
              className={styles.retryButton}
            >
              重新加载
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <Spin
      tip="正在加载PDF文件，请稍后..."
      spinning={loading}
      className={styles.spin}
      size="small"
    >
      <div className={styles.container}>
        <div
          className={styles.scrollContainer}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <div
            ref={containerRef}
            className={styles.pdfContainer}
          />
        </div>
      </div>
    </Spin>
  );
};

export default ViewPdf;