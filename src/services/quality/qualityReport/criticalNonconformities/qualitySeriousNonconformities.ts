import request from "@/utils/request";

/**
 * 查询本月严重不合格品情况
 * @param params
 */
export async function getQualitySeriousNonconformities(params: any) {
  return request("/api/ZyyjIms/quality/QualitySeriousNonconformities/getQualitySeriousNonconformities", {
    method: "GET",
    params,
  });
}

/**
 * 新增本月严重不合格品情况
 * @param params
 */
export async function addQualitySeriousNonconformities(params: any) {
  return request("/api/ZyyjIms/quality/QualitySeriousNonconformities/addQualitySeriousNonconformities", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改本月严重不合格品情况
 * @param params
 */
export async function updateQualitySeriousNonconformities(params: any) {
  return request("/api/ZyyjIms/quality/QualitySeriousNonconformities/updateQualitySeriousNonconformities", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除本月严重不合格品情况
 * @param params
 */
export async function deleteQualitySeriousNonconformities(params: any) {
  return request("/api/ZyyjIms/quality/QualitySeriousNonconformities/deleteQualitySeriousNonconformities", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
