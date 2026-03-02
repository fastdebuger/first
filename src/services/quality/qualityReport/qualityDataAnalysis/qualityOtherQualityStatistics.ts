import request from "@/utils/request";

/**
 * 查询其它质量数据统计情况
 * @param params
 */
export async function getQualityOtherQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityOtherQualityStatistics/getQualityOtherQualityStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 新增其它质量数据统计情况
 * @param params
 */
export async function addQualityOtherQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityOtherQualityStatistics/addQualityOtherQualityStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改其它质量数据统计情况
 * @param params
 */
export async function updateQualityOtherQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityOtherQualityStatistics/updateQualityOtherQualityStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除其它质量数据统计情况
 * @param params
 */
export async function deleteQualityOtherQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityOtherQualityStatistics/deleteQualityOtherQualityStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
