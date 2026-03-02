import request from "@/utils/request";

/**
 * 查询供应人员信息
 * @param params
 */
export async function getMaterialInnerUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialInnerUser", {
    method: "GET",
    params,
  });
}

/**
 * 添加供应人员信息
 * @param params
 */
export async function addMaterialInnerUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialInnerUser", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改供应人员信息
 * @param params
 */
export async function updateMaterialInnerUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialInnerUser", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除供应人员信息
 * @param params
 */
export async function deleteMaterialInnerUser(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMaterialInnerUser", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
