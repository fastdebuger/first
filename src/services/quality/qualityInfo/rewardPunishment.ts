import request from "@/utils/request";

/**
 * 查询质量承包商信息表
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/quality/rewardPunishment/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量承包商信息表
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/quality/rewardPunishment/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量承包商信息表
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/quality/rewardPunishment/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量承包商信息表
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/quality/rewardPunishment/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 统计质量记分信息
 * @param params
 */
export async function queryQualityScoringStat(params: any) {
  return request("/api/ZyyjIms/quality/scoringPersonnel/queryQualityScoringStat", {
    method: "GET",
    params,
  });
}