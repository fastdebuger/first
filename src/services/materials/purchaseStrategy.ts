import request from "@/utils/request";


/**
 * 新增物资及服务总体采购策略
 * @param params
 */
export async function addMaterialsPurchaseStrategy(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategy/addMaterialsPurchaseStrategy", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除物资及服务总体采购策略
 * @param params
 */
export async function deleteMaterialsPurchaseStrategy(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategy/deleteMaterialsPurchaseStrategy", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询物资及服务总体采购策略表头
 * @param params
 */
export async function getMaterialsPurchaseStrategy(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategy/getMaterialsPurchaseStrategy", {
    method: "GET",
    params,
  });
}

/**
 * 修改物资及服务总体采购策略
 * @param params
 */
export async function updateMaterialsPurchaseStrategy(params: any) {
  return request("/api/ZyyjIms/materials/purchaseStrategy/purchaseStrategy/updateMaterialsPurchaseStrategy", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
