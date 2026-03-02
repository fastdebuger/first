import request from "@/utils/request";

/**
 * 查询自产产品制造质量情况
 * @param params
 */
export async function getQualityProducedProducts(params: any) {
  return request("/api/ZyyjIms/quality/QualityProducedProducts/getQualityProducedProducts", {
    method: "GET",
    params,
  });
}

/**
 * 新增自产产品制造质量情况
 * @param params
 */
export async function addQualityProducedProducts(params: any) {
  return request("/api/ZyyjIms/quality/QualityProducedProducts/addQualityProducedProducts", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改自产产品制造质量情况
 * @param params
 */
export async function updateQualityProducedProducts(params: any) {
  return request("/api/ZyyjIms/quality/QualityProducedProducts/updateQualityProducedProducts", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除自产产品制造质量情况
 * @param params
 */
export async function deleteQualityProducedProducts(params: any) {
  return request("/api/ZyyjIms/quality/QualityProducedProducts/deleteQualityProducedProducts", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
