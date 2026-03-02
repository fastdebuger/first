import request from "@/utils/request";

/**
 * 查询技术服务质量情况
 * @param params
 */
export async function getQualityTechServiceQuality(params: any) {
  return request("/api/ZyyjIms/quality/QualityTechServiceQuality/getQualityTechServiceQuality", {
    method: "GET",
    params,
  });
}

/**
 * 新增技术服务质量情况
 * @param params
 */
export async function addQualityTechServiceQuality(params: any) {
  return request("/api/ZyyjIms/quality/QualityTechServiceQuality/addQualityTechServiceQuality", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改技术服务质量情况
 * @param params
 */
export async function updateQualityTechServiceQuality(params: any) {
  return request("/api/ZyyjIms/quality/QualityTechServiceQuality/updateQualityTechServiceQuality", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除技术服务质量情况
 * @param params
 */
export async function deleteQualityTechServiceQuality(params: any) {
  return request("/api/ZyyjIms/quality/QualityTechServiceQuality/deleteQualityTechServiceQuality", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
