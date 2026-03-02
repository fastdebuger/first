import request from "@/utils/request";

/**
 * 查询供应商合同
 * @param params
 */
export async function getSupplierContract(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContract/getSupplierContract", {
    method: "GET",
    params,
  });
}

/**
 * 新增供应商合同
 * @param params
 */
export async function addSupplierContract(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContract/addSupplierContract", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改供应商合同
 * @param params
 */
export async function updateSupplierContract(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContract/updateSupplierContract", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除供应商合同
 * @param params
 */
export async function deleteSupplierContract(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContract/deleteSupplierContract", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入供应商合同
 * @param params
 */
export async function importIncomeInfo(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContract/importIncomeInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
