import request from "@/utils/request";

/**
 * 查询领料人员信息
 * @param params
 */
export async function getMaterialOuterUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialOuterUser", {
    method: "GET",
    params,
  });
}

/**
 * 添加领料人员信息
 * @param params
 */
export async function addMaterialOuterUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialOuterUser", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改领料人员信息
 * @param params
 */
export async function updateMaterialOuterUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialOuterUser", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除领料人员信息
 * @param params
 */
export async function deleteMaterialOuterUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMaterialOuterUser", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
