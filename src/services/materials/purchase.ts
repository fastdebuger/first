import request from "@/utils/request";


/**
 * 新增采购组
 * @param params
 */
export async function addPurchaseGroup(params: any) {
  return request("/api/ZyyjIms/basic/purchaseGroup/addPurchaseGroup", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除采购组
 * @param params
 */
export async function deletePurchaseGroup(params: any) {
  return request("/api/ZyyjIms/basic/purchaseGroup/deletePurchaseGroup", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询采购组
 * @param params
 */
export async function getPurchaseGroup(params: any) {
  return request("/api/ZyyjIms/basic/purchaseGroup/getPurchaseGroup", {
    method: "GET",
    params,
  });
}

/**
 * 修改采购组
 * @param params
 */
export async function updatePurchaseGroup(params: any) {
  return request("/api/ZyyjIms/basic/purchaseGroup/updatePurchaseGroup", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
