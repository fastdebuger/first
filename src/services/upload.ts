import request from '@/utils/request';

interface FileUploadParams {
  filePath: string;
}

/**
 * 上传文件
 * @param params
 */
export async function upLoad(params: FileUploadParams) {
  return request(`/file/aut/upLoad`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除文件
 * @param params
 */
export async function delFile(params: any) {
  return request('/file/aut/delFile', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 创建文件夹
 * @param params
 */
export async function mkDir(params: any) {
  return request('/file/aut/mkDir', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 批量下载文件
 * @param params
 */
export async function batchDownload(params: any) {
  return request('/api/ZyyjIms/bid/file/manage/batchDownload', {
    method: 'GET',
    params,
  });
}