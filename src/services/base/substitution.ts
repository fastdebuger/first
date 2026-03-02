import request from "@/utils/request";

/**
 * 查询物料代用信息
 * @param params
 */
export async function getMaterialProdSubstituteInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialProdSubstituteInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增物料代用信息
 * @param params
 */
export async function addMaterialProdSubstituteInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialProdSubstituteInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改物料代用信息
 * @param params
 */
export async function updateMaterialProdSubstituteInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialProdSubstituteInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除物料代用信息
 * @param params
 */
export async function deleteMaterialProdSubstituteInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMaterialProdSubstituteInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

