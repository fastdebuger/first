import request from "@/utils/request";

/**
 * 查询特种设备每月质量安全调度会议纪要信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafetyMonthly/dispatchMeeting/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增特种设备每月质量安全调度会议纪要信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafetyMonthly/dispatchMeeting/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备每月质量安全调度会议纪要信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafetyMonthly/dispatchMeeting/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除特种设备每月质量安全调度会议纪要信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafetyMonthly/dispatchMeeting/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备每月质量安全调度会议信息为审批中
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafetyMonthly/dispatchMeeting/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
