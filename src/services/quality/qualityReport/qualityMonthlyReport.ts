import request from "@/utils/request";

/**
 * 查询质量月报
 * @param params
 */
export async function getQualityMonthlyReport(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyReport/getQualityMonthlyReport", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量月报
 * @param params
 */
export async function addQualityMonthlyReport(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyReport/addQualityMonthlyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量月报
 * @param params
 */
export async function updateQualityMonthlyReport(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyReport/updateQualityMonthlyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量月报
 * @param params
 */
export async function deleteQualityMonthlyReport(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyReport/deleteQualityMonthlyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 发起审批
 * @param params
 */
export async function startApproval(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyReport/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
