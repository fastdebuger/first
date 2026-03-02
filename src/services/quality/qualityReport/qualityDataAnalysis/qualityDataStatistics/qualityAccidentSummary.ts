import request from "@/utils/request";

/**
 * 查询质量事故汇总表
 * @param params
 */
export async function getQualityAccidentSummary(params: any) {
  return request("/api/ZyyjIms/quality/QualityAccidentSummary/getQualityAccidentSummary", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量事故汇总表
 * @param params
 */
export async function addQualityAccidentSummary(params: any) {
  return request("/api/ZyyjIms/quality/QualityAccidentSummary/addQualityAccidentSummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量事故汇总表
 * @param params
 */
export async function updateQualityAccidentSummary(params: any) {
  return request("/api/ZyyjIms/quality/QualityAccidentSummary/updateQualityAccidentSummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量事故汇总表
 * @param params
 */
export async function deleteQualityAccidentSummary(params: any) {
  return request("/api/ZyyjIms/quality/QualityAccidentSummary/deleteQualityAccidentSummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
