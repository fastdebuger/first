import request from "@/utils/request";

/**
 * 查询物资类别
 * @param params
 */
export async function getMaterialCategory(params: any) {
  return request("/api/ZyyjIms/quality/MaterialCategory/getMaterialCategory", {
    method: "GET",
    params,
  });
}

/**
 * 新增物资类别
 * @param params
 */
export async function addMaterialCategory(params: any) {
  return request("/api/ZyyjIms/quality/MaterialCategory/addMaterialCategory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改物资类别
 * @param params
 */
export async function updateMaterialCategory(params: any) {
  return request("/api/ZyyjIms/quality/MaterialCategory/updateMaterialCategory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除物资类别
 * @param params
 */
export async function deleteMaterialCategory(params: any) {
  return request("/api/ZyyjIms/quality/MaterialCategory/deleteMaterialCategory", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
