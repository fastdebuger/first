import request from "@/utils/request";

/**
 * 查询在建项目资源结转情况
 * @param params
 */
export async function queryResourceOngoingProject(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryResourceOngoingProject", {
    method: "GET",
    params,
  });
}

/**
 * 查询公司级在建项目资源结转情况
 * @param params
 */
export async function queryResourceOngoingProjectStatictics(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryResourceOngoingProjectStatictics", {
    method: "GET",
    params,
  });
}



/**
 * 添加在建项目资源结转情况
 * @param params
 */
export async function addResourceOngoingProject(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/addResourceOngoingProject", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改在建项目资源结转情况
 * @param params
 */
export async function updateResourceOngoingProject(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/updateResourceOngoingProject", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除在建项目资源结转情况
 * @param params
 */
export async function delResourceOngoingProject(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/delResourceOngoingProject", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入在建项目资源结转情况
 * @param params
 */
export async function importResourceOngoingProject(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/importResourceOngoingProject", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function updateResourceOngoingProjectB1Extra(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/updateResourceOngoingProjectB1Extra", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function queryResourceOngoingProjectB1Extra(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryResourceOngoingProjectB1Extra", {
    method: "GET",
    params,
  });
}

/**
 * 查询去年的决策数据
 * @param params
 */
export async function queryResourceOngoingProjectBeforeJueCaiData(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryResourceOngoingProjectBeforeJueCaiData", {
    method: "GET",
    params,
  });
}


