import request from "@/utils/request";

/**
 * 获取特种设备质量安全风险管控清单信息
 * @param params
 */
export async function getHead(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/getHead", {
    method: "GET",
    params,
  });
}
/**
 * 获取特种设备质量安全风险管控清单表体信息
 * @param params
 */
export async function getBody(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/getBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询新增特种设备质量安全风险管控清单表
 * @param params
 */
export async function getFlat(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/getFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增新增特种设备质量安全风险管控清单表
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改新增特种设备质量安全风险管控清单表
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除新增特种设备质量安全风险管控清单表
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 获取特种设备质量安全风险管控清单配置表信息
 * @param params
 */
export async function querySafetyRiskControlConfig(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/config/getInfo", {
    method: "GET",
    params,
  });
}


/**
 * 修改特种设备质量安全风险管控清单为审批中
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}