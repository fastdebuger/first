import request from "@/utils/request";

/**
 * 查询质量大检查及专项检查情况
 * @param params
 */
export async function getQualityInspection(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspection/getQualityInspection", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量大检查及专项检查情况
 * @param params
 */
export async function addQualityInspection(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspection/addQualityInspection", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量大检查及专项检查情况
 * @param params
 */
export async function updateQualityInspection(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspection/updateQualityInspection", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量大检查及专项检查情况
 * @param params
 */
export async function deleteQualityInspection(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspection/deleteQualityInspection", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
