import request from "@/utils/request";

/**
 * 查询采购进度计划
 * @param params
 */
export async function getPurchaseStrategySchedule(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategySchedule/getPurchaseStrategySchedule", {
    method: "GET",
    params,
  });
}

/**
 * 新增采购进度计划
 * @param params
 */
export async function addPurchaseStrategySchedule(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategySchedule/addPurchaseStrategySchedule", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改采购进度计划
 * @param params
 */
export async function updatePurchaseStrategySchedule(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategySchedule/updatePurchaseStrategySchedule", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除采购进度计划
 * @param params
 */
export async function deletePurchaseStrategySchedule(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategySchedule/deletePurchaseStrategySchedule", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入采购进度计划
 * @param params
 */
export async function importPurchaseStrategySchedule(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategySchedule/importPurchaseStrategySchedule", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
