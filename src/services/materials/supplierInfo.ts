import request from "@/utils/request";


/**
 * 新增供应商信息台账
 * @param params
 */
export async function addSupplierLedger(params: any) {
  return request("/api/ZyyjIms/supplier/supplierLedger/addSupplierLedger", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除供应商信息台账
 * @param params
 */
export async function deleteSupplierLedger(params: any) {
  return request("/api/ZyyjIms/supplier/supplierLedger/deleteSupplierLedger", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询供应商信息台账
 * @param params
 */
export async function getSupplierLedger(params: any) {
  return request("/api/ZyyjIms/supplier/supplierLedger/getSupplierLedger", {
    method: "GET",
    params,
  });
}

/**
 * 修改供应商信息台账
 * @param params
 */
export async function updateSupplierLedger(params: any) {
  return request("/api/ZyyjIms/supplier/supplierLedger/updateSupplierLedger", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
