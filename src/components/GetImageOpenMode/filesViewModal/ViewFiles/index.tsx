import React from "react";
import {connect} from "umi";

/**
 *
 * @param props
 * @constructor
 */
const ViewFiles: React.FC<any> = (props: any) => {
  const {url} = props

  return (
    <div style={{width: '100%', height: '100%'}}>
      <iframe
        src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
        width="100%" height="95%" frameBorder="0"
        // @ts-ignore
        allowFullScreen sandbox>
        {/* 如果浏览器不支持<iframe>，就会显示内部的子元素。*/}
        <p><a href="https://www.example.com">点击打开嵌入页面</a></p>
      </iframe>
    </div>
  )
}

export default connect()(ViewFiles)
