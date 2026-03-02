import request from "@/utils/request";

/**
 * 查询特种设备网上告知相关信息统计表
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/onlineNotice/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增特种设备网上告知相关信息统计表
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/specialEquipment/onlineNotice/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备网上告知相关信息统计表
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/onlineNotice/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除特种设备网上告知相关信息统计表
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/specialEquipment/onlineNotice/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
