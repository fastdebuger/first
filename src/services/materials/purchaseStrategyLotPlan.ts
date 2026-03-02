import request from "@/utils/request";

/**
 * 查询工程物资单个标段策划方案
 * @param params
 */
export async function queryPurchaseStrategyLotPlanHead(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询工程物资单个标段策划方案
 * @param params
 */
export async function queryPurchaseStrategyLotPlanBody(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询工程物资单个标段策划方案
 * @param params
 */
export async function queryPurchaseStrategyLotPlanFlat(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategyLotPlan/queryPurchaseStrategyLotPlanFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增工程物资单个标段策划方案
 * @param params
 */
export async function addPurchaseStrategyLotPlan(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategyLotPlan/addPurchaseStrategyLotPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改工程物资单个标段策划方案
 * @param params
 */
export async function updatePurchaseStrategyLotPlan(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategyLotPlan/updatePurchaseStrategyLotPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除工程物资单个标段策划方案
 * @param params
 */
export async function delPurchaseStrategyLotPlan(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategyLotPlan/delPurchaseStrategyLotPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
