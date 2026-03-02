import request from "@/utils/request";

/**
 * 查询共享文件
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/risk/file/manage/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增共享文件
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/risk/file/manage/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改共享文件
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/risk/file/manage/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除共享文件
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/risk/file/manage/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
