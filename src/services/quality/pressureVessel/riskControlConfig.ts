import request from "@/utils/request";

/**
 * 查询特种设备质量安全风险管控清单配置表信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/config/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增特种设备质量安全风险管控清单配置表信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/config/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备质量安全风险管控清单配置表信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/config/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除特种设备质量安全风险管控清单配置表信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/safety/riskControl/config/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
