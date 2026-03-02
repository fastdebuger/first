import request from "@/utils/request";

/**
 * 查询特种设备职务配置表信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/postConfig/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增特种设备职务配置表信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/postConfig/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备职务配置表信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/postConfig/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除特种设备职务配置表信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/postConfig/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
