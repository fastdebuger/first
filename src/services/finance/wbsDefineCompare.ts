import request from "@/utils/request";

/**
 * 查询对照表
 * @param params
 */
export async function queryWbsDefineCompare(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryWbsDefineCompare", {
    method: "GET",
    params,
  });
}


/**
 * 添加对照表
 * @param params
 */
export async function addWbsDefineCompare(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/addWbsDefineCompare", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改对照表
 * @param params
 */
export async function updateWbsDefineCompare(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/updateWbsDefineCompare", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除对照表
 * @param params
 */
export async function delWbsDefineCompare(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/delWbsDefineCompare", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入对照表
 * @param params
 */
export async function importWbsDefineCompare(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/importWbsDefineCompare", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
