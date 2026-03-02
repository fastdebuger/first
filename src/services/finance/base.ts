import request from "@/utils/request";

/**
 * 查询财务公式表
 * @param params
 */
export async function queryFormula(params: any) {
  return request("/api/ZyyjIms/finance/base/queryFormula", {
    method: "GET",
    params,
  });
}


/**
 * 修改财务公式表
 * @param params
 */
export async function updateFormula(params: any) {
  return request("/api/ZyyjIms/finance/base/updateFormula", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
