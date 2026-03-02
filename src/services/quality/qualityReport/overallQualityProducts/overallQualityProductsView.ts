import request from "@/utils/request";

/**
 * 查询工程产品总体质量概述
 * @param params
 */
export async function getQualityProjectQualityOverview(params: any) {
  return request("/api/ZyyjIms/quality/QualityProjectQualityOverview/getQualityProjectQualityOverview", {
    method: "GET",
    params,
  });
}

/**
 * 新增工程产品总体质量概述
 * @param params
 */
export async function addQualityProjectQualityOverview(params: any) {
  return request("/api/ZyyjIms/quality/QualityProjectQualityOverview/addQualityProjectQualityOverview", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量新增工程产品总体质量概述
 * @param params
 */
 export async function saveBatchProjectQualityOverview(params: any) {
  return request("/api/ZyyjIms/quality/QualityProjectQualityOverview/saveBatchProjectQualityOverview", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改工程产品总体质量概述
 * @param params
 */
export async function updateQualityProjectQualityOverview(params: any) {
  return request("/api/ZyyjIms/quality/QualityProjectQualityOverview/updateQualityProjectQualityOverview", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除工程产品总体质量概述
 * @param params
 */
export async function deleteQualityProjectQualityOverview(params: any) {
  return request("/api/ZyyjIms/quality/QualityProjectQualityOverview/deleteQualityProjectQualityOverview", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
