import request from "@/utils/request";

/**
 * 查询货位信息
 * @param params
 */
export async function getMaterialSeatInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialSeatInfo", {
    method: "GET",
    params,
  });
}

/**
 * 添加货位信息
 * @param params
 */
export async function addMaterialSeatInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialSeatInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改货位信息
 * @param params
 */
export async function updateMaterialSeatInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialSeatInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除货位信息
 * @param params
 */
export async function deleteMaterialSeatInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMaterialSeatInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
