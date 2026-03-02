import request from "@/utils/request";

/**
 * 查询质量统计数据分析情况
 * @param params
 */
export async function getQualityStatisticsAnalysis(params: any) {
  return request("/api/ZyyjIms/quality/QualityStatisticsAnalysis/getQualityStatisticsAnalysis", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量统计数据分析情况
 * @param params
 */
export async function addQualityStatisticsAnalysis(params: any) {
  return request("/api/ZyyjIms/quality/QualityStatisticsAnalysis/addQualityStatisticsAnalysis", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量统计数据分析情况
 * @param params
 */
export async function updateQualityStatisticsAnalysis(params: any) {
  return request("/api/ZyyjIms/quality/QualityStatisticsAnalysis/updateQualityStatisticsAnalysis", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量统计数据分析情况
 * @param params
 */
export async function deleteQualityStatisticsAnalysis(params: any) {
  return request("/api/ZyyjIms/quality/QualityStatisticsAnalysis/deleteQualityStatisticsAnalysis", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
