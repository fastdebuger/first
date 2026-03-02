import request from "@/utils/request";

/**
 * 查询往来单位
 * @param params
 */
export async function queryBusinessPartner(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryBusinessPartner", {
    method: "GET",
    params,
  });
}


/**
 * 添加往来单位
 * @param params
 */
export async function addBusinessPartner(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/addBusinessPartner", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改往来单位
 * @param params
 */
export async function updateBusinessPartner(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/updateBusinessPartner", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除往来单位
 * @param params
 */
export async function delBusinessPartner(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/delBusinessPartner", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入往来单位
 * @param params
 */
export async function importBusinessPartner(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/importBusinessPartner", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
