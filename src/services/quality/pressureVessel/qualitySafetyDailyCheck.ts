import request from "@/utils/request";

/**
 * 查询特种设备每日质量安全检查记录信息
 * @param params
 */
export async function getHead(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/getHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询特种设备每日质量安全检查记录信息
 * @param params
 */
export async function getBody(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/getBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询特种设备每日质量安全检查记录信息
 * @param params
 */
export async function getFlat(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/getFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增特种设备每日质量安全检查记录信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备每日质量安全检查记录信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除特种设备每日质量安全检查记录信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 修改压力容器质保体系责任人员推荐信息为审批中
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询每日不合格项质量安全检查问题信息
 * @param params
 */
export async function queryUnQuality(params: any) {
  return request("/api/ZyyjIms/specialEquipment/qualitySafety/dailyCheck/queryUnQuality", {
    method: "GET",
    params,
  });
}