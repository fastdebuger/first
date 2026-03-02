import request from "@/utils/request";

/**
 * 查询仓库信息
 * @param params
 */
export async function getWarehouseInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/getWarehouseInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增仓库信息
 * @param params
 */
export async function addWarehouseInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/addWarehouseInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改仓库信息
 * @param params
 */
export async function updateWarehouseInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateWarehouseInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除仓库信息
 * @param params
 */
export async function deleteWarehouseInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteWarehouseInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
