import request from "@/utils/request";

/**
 * 查询仓库信息
 * @param params
 */
export async function getMaterialStorageInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialStorageInfo", {
    method: "GET",
    params,
  });
}

/**
 * 添加仓库信息
 * @param params
 */
export async function addMaterialStorageInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialStorageInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改仓库信息
 * @param params
 */
export async function updateMaterialStorageInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialStorageInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除仓库信息
 * @param params
 */
export async function deleteMaterialStorageInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMaterialStorageInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
