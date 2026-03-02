import request from "@/utils/request";

/**
 * 查询采购计划
 * @param params
 */
export async function queryPoPlanHead(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/queryPoPlanHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询采购计划
 * @param params
 */
export async function queryPoPlanBody(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/queryPoPlanBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询采购计划
 * @param params
 */
export async function queryPoPlanFlat(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/queryPoPlanFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增采购计划
 * @param params
 */
export async function addPoPlan(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/addPoPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改采购计划
 * @param params
 */
export async function updatePoPlan(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/updatePoPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除采购计划
 * @param params
 */
export async function delPoPlan(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/delPoPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
