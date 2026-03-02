import request from "@/utils/request";

/**
 * 查询特种设备每周质量安全检查记录信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/weekCheck/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增特种设备每周质量安全检查记录信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/weekCheck/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备每周质量安全检查记录信息
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/weekCheck/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除特种设备每周质量安全检查记录信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/weekCheck/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备每周质量安全检查记录信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/weekCheck/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 校验每日质量安全检查是否本周全部录入
 * @param params
 */
export async function checkDailyReport(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/weekCheck/checkDailyReport", {
    method: "GET",
    params,
  });
}
