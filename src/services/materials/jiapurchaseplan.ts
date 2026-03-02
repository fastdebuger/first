import request from "@/utils/request";


/**
 * 查询甲供需求计划单表头
 * @param params
 */
export async function queryPurchasePlanHead(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/queryPurchasePlanHead", {
    method: "GET",
    params,
  });
}

/**
 * 查询甲供需求计划单表体
 * @param params
 */
export async function queryPurchasePlanBody(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/queryPurchasePlanBody", {
    method: "GET",
    params,
  });
}

/**
 * 查询甲供需求计划单平铺
 * @param params
 */
export async function queryPurchasePlanFlat(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/queryPurchasePlanFlat", {
    method: "GET",
    params,
  });
}

/**
 * 添加甲供需求计划单
 * @param params
 */
export async function addPurchasePlan(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/addPurchasePlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改甲供需求计划单
 * @param params
 */
export async function updatePurchasePlan(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/updatePurchasePlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除甲供需求计划单
 * @param params
 */
export async function delPurchasePlan(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/delPurchasePlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量甲供需求计划单
 * @param params
 */
export async function batchDelPurchasePlan(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/batchDelPurchasePlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 初始化审批流程
 * @param params
 */
export async function initProcessInstance(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/initProcessInstance", {
    method: "POST",
    data: params,
    requestType: "form",
  });


}

/**
 * 导入
 * @param params
 */
export async function importPurchasePlan(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/importPurchasePlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询需求计划版本表头
 * @param params
 */
export async function queryPurchasePlanVersionHead(params: any) {
  return request("/api/ZyyjIms/version/queryPurchasePlanVersionHead", {
    method: "GET",
    params,
  });
}
export async function queryPipeVersionCodeLst(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/queryPipeVersionCodeLst", {
    method: "GET",
    params,
  });
}
export async function queryPurchasePlanPipeLst(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/queryPurchasePlanPipeLst", {
    method: "GET",
    params,
  });
}
export async function queryPurchasePlanHistory(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/queryPurchasePlanHistory", {
    method: "GET",
    params,
  });
}
/**
 * 查询需求计划版本表体
 * @param params
 */
export async function queryPurchasePlanVersionBody(params: any) {
  return request("/api/ZyyjIms/version/queryPurchasePlanVersionBody", {
    method: "GET",
    params,
  });
}

/**
 * 比对需求计划两个版本之间的差异
 * @param params
 */
export async function comparePurchasePlanVersionData(params: any) {
  return request("/api/ZyyjIms/version/comparePurchasePlanVersionData", {
    method: "GET",
    params,
  });
}
export async function importPurchasePlanByInteraction(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/importPurchasePlanByInteraction", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function modifyImportPurchasePlanVal(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/modifyImportPurchasePlanVal", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
