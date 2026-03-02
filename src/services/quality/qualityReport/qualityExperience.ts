import request from "@/utils/request";

/**
 * 查询质量经验分享
 * @param params
 */
export async function getQualityExperience(params: any) {
  return request("/api/ZyyjIms/quality/QualityExperience/getQualityExperience", {
    method: "GET",
    params,
  });
}

/**
 * 查询月报填报情况
 * @param params
 */
export async function queryDataExist(params: any) {
  return request("/api/ZyyjIms/quality/QualityProjectQualityOverview/queryDataExist", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 新增质量经验分享
 * @param params
 */
export async function addQualityExperience(params: any) {
  return request("/api/ZyyjIms/quality/QualityExperience/addQualityExperience", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量经验分享
 * @param params
 */
export async function updateQualityExperience(params: any) {
  return request("/api/ZyyjIms/quality/QualityExperience/updateQualityExperience", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量经验分享
 * @param params
 */
export async function deleteQualityExperience(params: any) {
  return request("/api/ZyyjIms/quality/QualityExperience/deleteQualityExperience", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
