import request from "@/utils/request";

/**
 * 查询市场开发指标
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/market/development/indicators/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增市场开发指标
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/market/development/indicators/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改市场开发指标
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/market/development/indicators/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除市场开发指标
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/market/development/indicators/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
