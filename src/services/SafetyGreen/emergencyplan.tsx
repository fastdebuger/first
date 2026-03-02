import request from "@/utils/request";

/**
 * 查询应急预案模板表头
 * @param params
 */
export async function queryContingencyPlanConfigHead(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlanConfig/queryContingencyPlanConfigHead", {
    method: "GET",
    params,
  });
}

/**
 * 查询应急预案模板表体
 * @param params
 */
export async function queryContingencyPlanConfigBody(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlanConfig/queryContingencyPlanConfigBody", {
    method: "GET",
    params,
  });
}

/**
 * 查询应急预案模板平铺
 * @param params
 */
export async function queryContingencyPlanConfigFlat(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlanConfig/queryContingencyPlanConfigFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增应急预案模板
 * @param params
 */
export async function addContingencyPlanConfig(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlanConfig/addContingencyPlanConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 编辑应急预案模板
 * @param params
 */
export async function updateContingencyPlanConfig(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlanConfig/updateContingencyPlanConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 删除应急预案模板
 * @param params
 */
export async function delContingencyPlanConfig(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlanConfig/delContingencyPlanConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询应急预案台账
 * @param params
 */
export async function getContingencyPlan(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/getContingencyPlan", {
    method: "GET",
    params,
  });
}



/**
 * 新增应急预案
 * @param params
 */
export async function addContingencyPlan(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/addContingencyPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 编辑应急预案
 * @param params
 */
export async function updateContingencyPlan(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/updateContingencyPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 编辑应急预案
 * @param params
 */
export async function updateContingencyPlanB(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/updateContingencyPlanB", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 删除应急预案
 * @param params
 */
export async function deleteContingencyPlan(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/deleteContingencyPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询应急预案台账表头
 * @param params
 */
export async function getContingencyPlanHead(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/getContingencyPlanHead", {
    method: "GET",
    params,
  });
}

/**
 * 查询应急预案台账表体
 * @param params
 */
export async function getContingencyPlanBody(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/getContingencyPlanBody", {
    method: "GET",
    params,
  });
}

/**
 * 查询应急预案台账平铺
 * @param params
 */
export async function getContingencyPlanFlat(params: any) {
  return request("/api/ZyyjIms/legislation/contingencyPlan/getContingencyPlanFlat", {
    method: "GET",
    params,
  });
}