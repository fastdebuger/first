import request from "@/utils/request";

/**
 * 查询经验分享
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/experience/sharing/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增经验分享
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/experience/sharing/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改经验分享
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/experience/sharing/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除经验分享
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/experience/sharing/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询经验分享
 * @param params
 */
export async function getApprovalList(params: any) {
  return request("/api/ZyyjIms/experience/sharing/getApprovalList", {
    method: "GET",
    params,
  });
}

/**
 * 修改经验分享
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/experience/sharing/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除经验分享
 * @param params
 */
export async function saveTouchViewsInfo(params: any) {
  return request("/api/ZyyjIms/experience/sharing/saveTouchViewsInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询经验分享的下载量喜爱度
 * @param params
 */
export async function getStats(params: any) {
  return request("/api/ZyyjIms/experience/sharing/getStats", {
    method: "GET",
    params,
  });
}


/**
 * 查询审批通过的知识库以及统计情况
 * @param params
 */
export async function getExpSharingPassAndStatsInfo(params: any) {
  return request("/api/ZyyjIms/experience/sharing/getExpSharingPassAndStatsInfo", {
    method: "GET",
    params,
  });
}