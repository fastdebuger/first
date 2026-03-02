import request from "@/utils/request";

/**
 * 查询HSE重大风险清单
 * @param params
 */
export async function getTechnologyHseRiskControlList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlList/getTechnologyHseRiskControlList", {
    method: "GET",
    params,
  });
}

/**
 * 新增HSE重大风险清单
 * @param params
 */
export async function addTechnologyHseRiskControlList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlList/addTechnologyHseRiskControlList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改HSE重大风险清单
 * @param params
 */
export async function updateTechnologyHseRiskControlList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlList/updateTechnologyHseRiskControlList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除HSE重大风险清单
 * @param params
 */
export async function deleteTechnologyHseRiskControlList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlList/deleteTechnologyHseRiskControlList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入HSE重大风险清单
 * @param params
 */
export async function importTechnologyHseRiskControlList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlList/importTechnologyHseRiskControlList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
