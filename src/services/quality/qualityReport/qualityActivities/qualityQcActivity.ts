import request from "@/utils/request";

/**
 * 查询QC小组活动开展情况
 * @param params
 */
export async function getQualityQcActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityQcActivity/getQualityQcActivity", {
    method: "GET",
    params,
  });
}

/**
 * 新增QC小组活动开展情况
 * @param params
 */
export async function addQualityQcActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityQcActivity/addQualityQcActivity", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改QC小组活动开展情况
 * @param params
 */
export async function updateQualityQcActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityQcActivity/updateQualityQcActivity", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除QC小组活动开展情况
 * @param params
 */
export async function deleteQualityQcActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityQcActivity/deleteQualityQcActivity", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
