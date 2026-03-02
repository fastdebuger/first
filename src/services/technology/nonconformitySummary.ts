import request from "@/utils/request";

/**
 * 查询合格品汇总
 * @param params
 */
export async function getTechnologyQcNonconformitySummary(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyQcNonconformitySummary/getTechnologyQcNonconformitySummary", {
    method: "GET",
    params,
  });
}

/**
 * 新增合格品汇总
 * @param params
 */
export async function addTechnologyQcNonconformitySummary(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyQcNonconformitySummary/addTechnologyQcNonconformitySummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改合格品汇总
 * @param params
 */
export async function updateTechnologyQcNonconformitySummary(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyQcNonconformitySummary/updateTechnologyQcNonconformitySummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除合格品汇总
 * @param params
 */
export async function deleteTechnologyQcNonconformitySummary(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyQcNonconformitySummary/deleteTechnologyQcNonconformitySummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入不合格品汇总
 * @param params
 */
export async function importTechnologyQcNonconformitySummary(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyQcNonconformitySummary/importTechnologyQcNonconformitySummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


