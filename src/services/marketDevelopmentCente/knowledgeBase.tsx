import request from "@/utils/request";

/**
 * 查询知识库文件管理
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/manage/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增知识库文件管理
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/manage/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改知识库文件管理
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/manage/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除知识库文件管理
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/manage/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
