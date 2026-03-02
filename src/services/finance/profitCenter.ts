import request from "@/utils/request";

/**
 * 查询利润中心
 * @param params
 */
export async function queryProfitCenter(params: any) {
  return request("/api/ZyyjIms/finance/base/queryProfitCenter", {
    method: "GET",
    params,
  });
}


/**
 * 添加利润中心
 * @param params
 */
export async function addProfitCenter(params: any) {
  return request("/api/ZyyjIms/finance/base/addProfitCenter", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改利润中心
 * @param params
 */
export async function updateProfitCenter(params: any) {
  return request("/api/ZyyjIms/finance/base/updateProfitCenter", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除利润中心
 * @param params
 */
export async function delProfitCenter(params: any) {
  return request("/api/ZyyjIms/finance/base/delProfitCenter", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入利润中心
 * @param params
 */
export async function importProfitCenter(params: any) {
  return request("/api/ZyyjIms/finance/base/importProfitCenter", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
