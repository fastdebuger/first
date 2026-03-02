import React, { useState, useEffect, useMemo } from "react";
import ShowImgListSubcontractor from "./showImgList";
import FilesViewModal from "./filesViewModal";
import { Button, Space, Tooltip } from "antd";

function getFileNameFromUrl(url: string | undefined) {
  if (!url) return '/'
  // 找到最后一个斜杠的位置
  const lastSlashIndex = url.lastIndexOf('/');
  // 截取最后一个斜杠之后的部分作为文件名候选
  const fileNamePart = lastSlashIndex !== -1 ? url.slice(lastSlashIndex + 1) : url;
  // 找到点号的位置
  const dotIndex = fileNamePart.indexOf('.');
  // 如果存在点号，返回点号之前的部分作为文件名；否则返回完整的文件名候选
  return dotIndex !== -1 ? fileNamePart.slice(0, dotIndex) : fileNamePart;
}

// 示例使用
const url = 'https://example.com/path/to/image.jpg';
const fileName = getFileNameFromUrl(url);

interface IEditViewFileComponent {
  url: string; //链接
  title?: string;
  value: string;
}

/**
 * 新增、编辑的时候，表体展示图片用到的组件 （直接写在页面的setTableColumns里面的话，state更新会使table更新导致表体数据丢失）
 * @param props
 * @constructor
 */
const EditViewFileComponent: React.FC<IEditViewFileComponent> = (props: any) => {
  const { url, title, isShowTitle = false } = props;
  const [urlList, setUrlList] = useState<any[]>([]);
  const [imgVisible, setImgVisible] = useState<boolean>(false);
  const [viewFilesVisible, setViewFilesVisible] = useState<boolean>(false);
  //文件类型
  const fileType = useMemo(() => {
    return url?.split(".")[url.split(".").length - 1]
  }, [url])

  const handlerOpen = () => {
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      //照片
      setUrlList([url]);
      setImgVisible(true);
    } else {
      //视频文件等
      setUrlList([url])
      setViewFilesVisible(true);
    }
  }
  return (
    <div>
      <img
        style={{ padding: "0", width: 25, cursor: "pointer" }}
        onClick={handlerOpen}
        src={url ?
          `https://stccswpmtop.obs.cn-north-1.myhuaweicloud.com/app-image/fileTypeIcon/${fileType}.png` : ''}
      />
      {
        imgVisible &&
        <ShowImgListSubcontractor
          visible={imgVisible}
          setVisible={(visible: boolean) => setImgVisible(visible)}
          imgList={urlList}
        />
      }
      {
        viewFilesVisible &&
        <FilesViewModal
          visible={viewFilesVisible}
          onCancel={() => setViewFilesVisible(false)}
          url={urlList[0]}
          title={title}
        />
      }
      {isShowTitle && (
        <Tooltip title={getFileNameFromUrl(url)}>
          <p style={{
            width: "7ch", /* 限制宽度为 5 个字符的宽度，ch 是字符单位 */
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {getFileNameFromUrl(url)}
          </p>
        </Tooltip>

      )}
    </div>
  )
}

export default EditViewFileComponent;
