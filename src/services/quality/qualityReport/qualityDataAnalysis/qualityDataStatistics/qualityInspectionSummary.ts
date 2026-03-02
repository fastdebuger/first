import request from "@/utils/request";

/**
 * 查询质量大专项检查主要不合格项汇总情况分布
 * @param params
 */
export async function queryQualityInspectionSummaryHead(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspectionSummary/queryQualityInspectionSummaryHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询质量大专项检查主要不合格项汇总情况分布
 * @param params
 */
export async function queryQualityInspectionSummaryBody(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspectionSummary/queryQualityInspectionSummaryBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询质量大专项检查主要不合格项汇总情况分布
 * @param params
 */
export async function queryQualityInspectionSummaryFlat(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspectionSummary/queryQualityInspectionSummaryFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量大专项检查主要不合格项汇总情况分布
 * @param params
 */
export async function addQualityInspectionSummary(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspectionSummary/addQualityInspectionSummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量大专项检查主要不合格项汇总情况分布
 * @param params
 */
export async function updateQualityInspectionSummary(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspectionSummary/updateQualityInspectionSummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量大专项检查主要不合格项汇总情况分布
 * @param params
 */
export async function delQualityInspectionSummary(params: any) {
  return request("/api/ZyyjIms/quality/QualityInspectionSummary/delQualityInspectionSummary", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询质量大专项检查主要不合格项汇总情况分布备选
 * @param params
 */
export async function getSysDict(params: any) {
  return request("/api/ZyyjIms/basic/sysDict/getSysDict", {
    method: "GET",
    params,
  });
}
