import request from "@/utils/request";

/**
 * 查询甲供分割预算表头
 * @param params
 */
export async function querySplitBudgetHead(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/querySplitBudgetHead", {
    method: "GET",
    params,
  });
}

/**
 * 查询甲供分割预算表体
 * @param params
 */
export async function querySplitBudgetBody(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/querySplitBudgetBody", {
    method: "GET",
    params,
  });
}

/**
 * 查询甲供分割预算平铺
 * @param params
 */
export async function querySplitBudgetFlat(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/querySplitBudgetFlat", {
    method: "GET",
    params,
  });
}

/**
 * 添加甲供分割预算
 * @param params
 */
export async function addSplitBudget(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/addSplitBudget", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改甲供分割预算
 * @param params
 */
export async function updateSplitBudget(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/updateSplitBudget", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除甲供分割预算
 * @param params
 */
export async function delSplitBudget(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/delSplitBudget", {
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
  return request("/api/ZyyjIms/jiaBuss/split/budget/initProcessInstance", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询备选数据
 * @param params
 */
export async function queryBakData(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/queryBakData", {
    method: "GET",
    params,
  });
}

/**
 * 导入甲供分割预算
 * @param params
 */
export async function importSplitBudget(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/importSplitBudget", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询分割超计划扣除明细
 * @param params
 */
export async function queryDeductionListDetail(params: any) {
  return request("/api/ZyyjIms/jiaBuss/split/budget/queryDeductionListDetail", {
    method: "GET",
    params,
  });
}/**
 * 查询层级备选
 * @param params
 */
export async function queryPipeCodeByProdCode(params: any) {
  return request("/api/ZyyjIms/jiaBuss/purchasePlan/queryPipeCodeByProdCode", {
    method: "GET",
    params,
  });
}


/**
 * 查询分割预算版本表头
 * @param params
 */
export async function querySplitBudgetVersionHead(params: any) {
  return request("/api/ZyyjIms/version/querySplitBudgetVersionHead", {
    method: "GET",
    params,
  });
}

/**
 * 查询分割预算版本表体
 * @param params
 */
export async function querySplitBudgetVersionBody(params: any) {
  return request("/api/ZyyjIms/version/querySplitBudgetVersionBody", {
    method: "GET",
    params,
  });
}

/**
 * 比对分割预算两个版本之间的差异
 * @param params
 */
export async function compareSplitBudgetVersionData(params: any) {
  return request("/api/ZyyjIms/version/compareSplitBudgetVersionData", {
    method: "GET",
    params,
  });
}
