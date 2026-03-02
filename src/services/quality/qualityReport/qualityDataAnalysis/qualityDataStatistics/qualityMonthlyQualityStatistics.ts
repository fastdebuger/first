import request from "@/utils/request";

/**
 * 查询质量数据统计表
 * @param params
 */
export async function getQualityMonthlyQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyQualityStatistics/getQualityMonthlyQualityStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量数据统计表
 * @param params
 */
export async function addQualityMonthlyQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyQualityStatistics/addQualityMonthlyQualityStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量数据统计表
 * @param params
 */
export async function updateQualityMonthlyQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyQualityStatistics/updateQualityMonthlyQualityStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量数据统计表
 * @param params
 */
export async function deleteQualityMonthlyQualityStatistics(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyQualityStatistics/deleteQualityMonthlyQualityStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
