import request from "@/utils/request";


/**
 * 新增平衡利库
 * @param params
 */
export async function addBalanceInventory(params: any) {
  return request("/api/ZyyjIms/supplier/balanceInventory/addBalanceInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除平衡利库
 * @param params
 */
export async function deleteBalanceInventory(params: any) {
  return request("/api/ZyyjIms/supplier/balanceInventory/deleteBalanceInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询平衡利库
 * @param params
 */
export async function queryBakData(params: any) {
  return request("/api/ZyyjIms/supplier/balanceInventory/queryBakData", {
    method: "GET",
    params,
  });
}

/**
 * 修改平衡利库
 * @param params
 */
export async function updateBalanceInventory(params: any) {
  return request("/api/ZyyjIms/supplier/balanceInventory/updateBalanceInventory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 添加采购计划一级分配
 * @param params
 */
export async function addPoPlanB1(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/addPoPlanB1", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询采购计划一级分配
 * @param params
 */
export async function queryPoPlan1(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/queryPoPlan1", {
    method: "GET",
    params,
  });
}

/**
 * 添加采购计划二级分配
 * @param params
 */
export async function addPoPlanB2(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/addPoPlanB2", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询采购计划二级分配
 * @param params
 */
export async function queryPoPlan2(params: any) {
  return request("/api/ZyyjIms/supplier/poPlan/queryPoPlan2", {
    method: "GET",
    params,
  });
}