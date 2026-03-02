import request from "@/utils/request";

/**
 * 查询材料费用
 * @param params
 */
export async function getMaterialBidConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialBidConfig", {
    method: "GET",
    params,
  });
}

/**
 * 材料费用修改
 * @param params
 */
export async function updateMaterialBidConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialBidConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 材料费用保存
 * @param params
 */
export async function addMaterialBidConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialBidConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量删除
 * @param params
 */
export async function batchDeleteMaterialBidConfig(params: any) {
  return request("/api/ZyyjIms/basic/basic/batchDeleteMaterialBidConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

