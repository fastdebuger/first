import request from "@/utils/request";

/**
 * 查询质量监督审核问题清单
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/quality/supervision/auditIssue/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量监督审核问题清单
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/quality/supervision/auditIssue/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量监督审核问题清单
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/quality/supervision/auditIssue/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量监督审核问题清单
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/quality/supervision/auditIssue/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 质量监督审核问题清单统计
 * @param params
 */
export async function queryStat(params: any) {
  return request("/api/ZyyjIms/quality/supervision/auditIssue/queryStat", {
    method: "GET",
    params,
  });
}

/**
 * 专业系统问题统计
 * @param params
 */
export async function getQualitySafetyInspectionSystemStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspectionSystemStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 安全要素统计
 * @param params
 */
export async function getQualitySafetyInspectionSystemStatisticsByHse(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspectionSystemStatisticsByHse", {
    method: "GET",
    params,
  });
}



/**
 * 导入质量监督审核问题清单信息
 * @param params
 */
export async function importInfo(params: any) {
  return request("/api/ZyyjIms/quality/supervision/auditIssue/importInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}