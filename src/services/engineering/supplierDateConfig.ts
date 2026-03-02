import request from "@/utils/request";

/**
 * 查询供应商打分日期配置
 * @param params
 */
export async function getSupplierDateConfig(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierDateConfig/getSupplierDateConfig", {
    method: "GET",
    params,
  });
}

/**
 * 新增供应商打分日期配置
 * @param params
 */
export async function addSupplierDateConfig(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierDateConfig/addSupplierDateConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改供应商打分日期配置
 * @param params
 */
export async function updateSupplierDateConfig(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierDateConfig/updateSupplierDateConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除供应商打分日期配置
 * @param params
 */
export async function deleteSupplierDateConfig(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierDateConfig/deleteSupplierDateConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入供应商打分日期配置
 * @param params
 */
export async function importSupplierDateConfig(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierDateConfig/importSupplierDateConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
