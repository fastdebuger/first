import request from "@/utils/request";

/**
 * 查询主合同结算管理
 * @param params
 */
export async function getSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/settlementManagement/getSettlementManagement", {
    method: "GET",
    params,
  });
}

/**
 * 新增主合同结算管理
 * @param params
 */
export async function addSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/settlementManagement/addSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改主合同结算管理
 * @param params
 */
export async function updateSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/settlementManagement/updateSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除主合同结算管理
 * @param params
 */
export async function deleteSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/settlementManagement/deleteSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 导出主合同结算管理
 * @param params
 */
export async function exportSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/settlementManagement/exportSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}




