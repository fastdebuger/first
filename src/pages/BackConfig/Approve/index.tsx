import React, {useEffect, useState} from "react";
import {connect} from "umi";
import {Spin} from "antd";

const Approve: React.FC<any> = () => {
  const [height, setHeight] = useState(0);
  const [spinning,setSpinning] = useState<boolean>(false);
  let [url,setUrl] = useState<string>('');
  useEffect(()=>{
    const handleMessage = (event: MessageEvent<any>) => {
      if (event.data.source === 'yayangFlowLoadSuccess') {
        const iframe: HTMLIFrameElement | null = document.getElementById('approval-template') as HTMLIFrameElement;

        /**
         * 审批流系统初始化加载传递请求需要的参数
         */
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            data:[
              {key:'auth-default-wbsCode',value:localStorage.getItem('auth-default-wbsCode')},
              {key:'x-auth-token',value:localStorage.getItem('x-auth-token') || ''},
              {key:'auth-default-userCode',value:localStorage.getItem('auth-default-userCode')},
              {key:'auth-default-userName',value:localStorage.getItem('auth-default-userName')},
            ],
            source:'yayangPutData'
          }, '*');
        }
      }
    }


    const getSrc = ():string=>{
      if(process.env.NODE_ENV === 'production'){
        return `${window.location.origin}/micro/comp/base/backconfig/flow/approve/flow/model`
      }else{
        window.addEventListener('message', handleMessage)
        return `${window.location.protocol}//${window.location.hostname}:3232/micro/comp/base/backconfig/flow/approve/flow/model`
      }
    }
    setUrl(getSrc())
    return () => {
      window.removeEventListener('message', handleMessage); // 清理监听器
    };

  },[])

  return (
    <div style={{margin: 8}}>
      <Spin spinning={spinning}>
        {url&&<iframe
          id={'approval-template'}
          style={{
            border: 'none',
          }}
          onLoad={() => {
            setHeight(window.document.body.scrollHeight - 98);
            setSpinning(false)
          }}
          scrolling='no'
          height={height}
          frameBorder='0'
          width='100%'
          src={url}
        />}
      </Spin>
    </div>
  );
};

export default connect()(Approve);
