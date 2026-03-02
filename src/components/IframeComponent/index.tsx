import React from "react";
import {Modal} from "antd";

/**
 * IframeComponent 组件的属性接口
 */
interface IframeComponentProps {
  /** 控制弹窗是否显示 */
  visible: boolean;
  /** 关闭弹窗的回调函数 */
  cancel: () => void;
  /** 弹窗标题 */
  title?: string;
  /** iframe 要加载的 URL 地址 */
  url?: string;
}

/**
 * Iframe 组件：在 Modal 中嵌入 iframe 显示外部页面
 * @param props - 组件属性
 * @returns React 组件
 */
const IframeComponent: React.FC<IframeComponentProps> = (props) => {
  const {visible, cancel, title, url} = props;
  return(
    <Modal
      title={title}
      visible={visible}
      onCancel={cancel}
      footer={null}
      width={'100vw'}
      style={{ top: 0, maxWidth: '100vw', paddingBottom: 0}}
      bodyStyle={{ height: 'calc(100vh - 55px)' }}
    >
      <iframe
        style={{display: 'inline-block',height: '100%',width: '100%',marginTop: 10}}
        src={url || ''}
      >
      </iframe>
    </Modal>
  )
}

export default IframeComponent;
