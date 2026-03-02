import request from "@/utils/request";

/**
 * 查询项目信息
 * @param params
 */
export async function queryProjectInformation(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryProjectInformation", {
    method: "GET",
    params,
  });
}

export async function queryProjectInformationMonthlyDetails(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryProjectInformationMonthlyDetails", {
    method: "GET",
    params,
  });
}

export async function queryProjectInformationStatistic(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryProjectInformationStatistic", {
    method: "GET",
    params,
  });
}




/**
 * 添加项目信息
 * @param params
 */
export async function addProjectInformation(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/addProjectInformation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改项目信息
 * @param params
 */
export async function updateProjectInformation(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/updateProjectInformation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除项目信息
 * @param params
 */
export async function delProjectInformation(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/delProjectInformation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入项目信息
 * @param params
 */
export async function importProjectInformation(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/importProjectInformation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
