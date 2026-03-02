import request from "@/utils/request";

/**
 * 查询工作安排及建议
 * @param params
 */
export async function getQualityManagementPlan(params: any) {
  return request("/api/ZyyjIms/quality/QualityManagementPlan/getQualityManagementPlan", {
    method: "GET",
    params,
  });
}

/**
 * 新增工作安排及建议
 * @param params
 */
export async function addQualityManagementPlan(params: any) {
  return request("/api/ZyyjIms/quality/QualityManagementPlan/addQualityManagementPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改工作安排及建议
 * @param params
 */
export async function updateQualityManagementPlan(params: any) {
  return request("/api/ZyyjIms/quality/QualityManagementPlan/updateQualityManagementPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除工作安排及建议
 * @param params
 */
export async function deleteQualityManagementPlan(params: any) {
  return request("/api/ZyyjIms/quality/QualityManagementPlan/deleteQualityManagementPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
