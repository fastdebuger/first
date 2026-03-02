import request from "@/utils/request";

/**
 * 查询年度HSE重大风险及控制措施清单 /  重要环境因素及控制措施清单
 * @param params
 */
export async function queryTechnologyHseRiskControlListYearHead(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询年度HSE重大风险及控制措施清单 /  重要环境因素及控制措施清单
 * @param params
 */
export async function queryTechnologyHseRiskControlListYearBody(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询年度HSE重大风险及控制措施清单 /  重要环境因素及控制措施清单
 * @param params
 */
export async function queryTechnologyHseRiskControlListYearFlat(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/queryTechnologyHseRiskControlListYearFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增年度HSE重大风险及控制措施清单 /  重要环境因素及控制措施清单
 * @param params
 */
export async function addTechnologyHseRiskControlListYear(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/addTechnologyHseRiskControlListYear", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改年度HSE重大风险及控制措施清单 /  重要环境因素及控制措施清单
 * @param params
 */
export async function updateTechnologyHseRiskControlListYear(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/updateTechnologyHseRiskControlListYear", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除年度HSE重大风险及控制措施清单 /  重要环境因素及控制措施清单
 * @param params
 */
export async function delTechnologyHseRiskControlListYea(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/delTechnologyHseRiskControlListYear", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入年度HSE重大风险及控制措施清单
 * @param params
 */
export async function importTechnologyHseRiskControlListYear(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/importTechnologyHseRiskControlListYear", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 重要环境因素及控制措施清单
 * @param params
 */
export async function importTechnologyHseRiskControlListYear2(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyHseRiskControlListYear/importTechnologyHseRiskControlListYear2", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
