import request from "@/utils/request";

/**
 * 查询物料分类配置
 * @param params
 */
export async function getMaterialClsConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialClsConfig", {
    method: "GET",
    params,
  });
}

/**
 * 添加物料分类配置
 * @param params
 */
export async function addMaterialClsConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialClsConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改物料分类配置
 * @param params
 */
export async function updateMaterialClsConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialClsConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除物料分类配置
 * @param params
 */
export async function deleteMaterialClsConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMaterialClsConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
