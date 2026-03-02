import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Modal } from "antd";
import SysLog from "@/pages/Procurement/Base/SysLog";

/**
 * 系统日志弹窗
 * @param props
 * @constructor
 */
const SysLogModal: React.FC<any> = (props: any) => {
  const { module } = props
  const [visible, setVisible] = useState<boolean>(false)
  return (
    <>
      <Button
        key="log"
        size='middle'
        type="primary"
        onClick={() => setVisible(true)}>
        物料追踪
      </Button>
      <Modal
        width={'100vw'}
        destroyOnClose
        style={{ top: 0, maxWidth: "100vw", paddingBottom: 0 }}
        bodyStyle={{ height: "calc(100vh - 55px)" }}
        visible={visible} footer={null} onCancel={() => setVisible(false)} title='物料追踪'>
        <SysLog module={module} />
      </Modal>
    </>
  );
};
export default connect()(SysLogModal);
