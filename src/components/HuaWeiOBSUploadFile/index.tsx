import React from "react";
import {Upload} from "@yayang/components";
import {HUA_WEI_OBS_CONFIG} from "@/common/const";

const UploadComponent: React.FC<any> = (props: any) => {
  const obj = {
    ...props,
    sysPath: props.sysPath ? props.sysPath : HUA_WEI_OBS_CONFIG.SYS_PATH.PIPE_WELD,
    folderPath: props.filePath ? props.filePath : '',
    onChange: (file: any) => {
      props.onChange(file?.response?.url, file);
    }
  }

  return (
    <>
      <Upload {...obj}/>
    </>

  )
}

export default UploadComponent;
