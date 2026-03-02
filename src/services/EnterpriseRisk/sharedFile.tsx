import request from "@/utils/request";

/**
 * 查询共享文件
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/file/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增共享文件
 * @param params
 */
export async function file(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/file/saveInfo", {
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
  return request("/api/ZyyjIms/risk/monitoring/project/file/updateInfo", {
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
  return request("/api/ZyyjIms/risk/monitoring/project/file/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
