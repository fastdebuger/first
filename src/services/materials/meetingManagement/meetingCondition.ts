import request from "@/utils/request";

/**
 * 查询会议上会条件设置
 * @param params
 */
export async function getConfig(params: any) {
  return request("/api/ZyyjIms/meeting/Vetting/getConfig", {
    method: "GET",
    params,
  });
}

/**
 * 新增会议上会条件设置
 * @param params
 */
export async function addConfig(params: any) {
  return request("/api/ZyyjIms/meeting/Vetting/addConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改会议上会条件设置
 * @param params
 */
export async function updateConfig(params: any) {
  return request("/api/ZyyjIms/meeting/Vetting/updateConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除会议上会条件设置
 * @param params
 */
export async function deleteConfig(params: any) {
  return request("/api/ZyyjIms/meeting/Vetting/deleteConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
