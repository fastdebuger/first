import { useState, useMemo } from 'react';
import { Button, DatePicker, Modal, Spin } from 'antd';
import { BASE_URL, BASE_PRO_URL } from '@/common/const';
/**
 * 查看报表组件
 */
const ViewTheReport = (props: any) => {
  const {
    path = "/webroot/decision/view/report",
    query = "?viewlet=WeldSys2.0/anquan/planB-word.cpt",
  } = props;

  // 控制 Modal 显示隐藏
  const [visible, setVisible] = useState(false);
  // 控制 iframe 加载状态
  const [loading, setLoading] = useState(true);
  

  /**
   * 生成 iframe 的 URL
   */
  const reportSrc = useMemo(() => {
    if (!visible) return "";
    const BaseUrl = process.env.BUILD_ENV === 'pro' ? BASE_PRO_URL : BASE_URL;
    let url = `${BaseUrl}${path}${query}`;
    // }
    return url
  }, [visible, path, query]);


  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        查看报表
      </Button>
      <Modal
        title="查看报表"
        visible={visible}
        onCancel={() => setVisible(false)}
        width="100%"
        footer={null}
        centered
        destroyOnClose
        style={{ maxWidth: '100vw', top: 0 }}
        bodyStyle={{
          height: 'calc(100vh - 55px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px'
        }}
      >
        {/* 报表容器 */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Spin spinning={loading} tip="报表加载中...">
            <iframe
              title="report-frame"
              style={{
                width: "100%",
                height: 'calc(100vh - 80px)',
                border: "1px solid #f0f0f0"
              }}
              src={reportSrc}
              onLoad={() => setLoading(false)}
            />
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default ViewTheReport;