import React from "react";
import BackendShowFile from './BackendShowFile'
import WebShowFile from './WebShowFile'

const ShowFile: React.FC<any> = (props: any) => {
  const obj = {
    ...props
  }
  const CloudRoute = localStorage.getItem('Cloud_Route'); //web前端上传 backend后端上传

  return (
    <>
      {CloudRoute === 'web' && <WebShowFile {...obj}/>}
      {CloudRoute === 'backend' && <BackendShowFile {...obj}/>}
    </>

  )
}

export default ShowFile;
