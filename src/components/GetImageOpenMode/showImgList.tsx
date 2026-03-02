import React from "react";
import {connect} from "umi";
import {Image} from "antd";

interface IShowImgListSubcontractor {
  visible: boolean; //控制是否显示
  setVisible: any; //用来设置visible的方法
  imgList: any[]; // 图片数组，ImgUrl为图片的路径
}

const ShowImgListSubcontractor: React.FC<IShowImgListSubcontractor> = (props) => {
  const {visible, setVisible, imgList} = props;

  return (
    imgList.length > 0 ?
      <div>
        <div style={{display: 'none'}}>
          <Image.PreviewGroup preview={{visible, onVisibleChange: vis => setVisible(vis)}}>
            {
              imgList.map((item: any) => {
                return <Image src={item}/>
              })
            }
          </Image.PreviewGroup>
        </div>
      </div> : <></>
  )
}

export default connect()(ShowImgListSubcontractor);
