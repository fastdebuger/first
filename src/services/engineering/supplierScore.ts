import request from "@/utils/request";

/**
 * 查询供应商得分
 * @param params
 */
export async function getSupplierScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierScore/getSupplierScore", {
    method: "GET",
    params,
  });
}

/**
 * 查询供应商得分
 * @param params
 */
export async function getCalculateScoreTime(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierScore/getCalculateScoreTime", {
    method: "GET",
    params,
  });
}


/**
 * 新增供应商得分
 * @param params
 */
export async function addSupplierScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierScore/addSupplierScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改供应商得分
 * @param params
 */
export async function updateSupplierScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierScore/updateSupplierScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除供应商得分
 * @param params
 */
export async function deleteSupplierScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierScore/deleteSupplierScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 计算当年供应商得分
 * @param params
 */
export async function calculateScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierScore/calculateScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
