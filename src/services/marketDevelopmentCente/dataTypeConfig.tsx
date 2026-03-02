import request from "@/utils/request";

/**
 * 查询市场开发中心文件知识库管理数据类型配置表信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/dataType/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增市场开发中心文件知识库管理数据类型配置表信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/dataType/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改市场开发中心文件知识库管理数据类型配置表信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/dataType/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除市场开发中心文件知识库管理数据类型配置表信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/bid/file/dataType/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
