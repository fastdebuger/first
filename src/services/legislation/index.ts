import request from "@/utils/request";

/**
 * 查询处置规程
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/file/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增处置规程
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/file/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改处置规程
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/file/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除处置规程
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/file/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
