import { request } from "@yayang/http";
/**
 * 上传文件
 * @param params
 */
export async function fsToken(params: any) {
  return request(`/file/aut/upLoad/fsToken`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 上传文件
 * @param params
 */
export async function upLoad(params: any) {
  return request(`/file/aut/upLoad`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}