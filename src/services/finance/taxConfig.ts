import request from "@/utils/request";

/**
 * 查询单位应纳增值税项目与会计科目的关系
 * @param params
 */
export async function queryAccountingValueAddeddConfig(params: any) {
  return request("/api/ZyyjIms/finance/tax/queryAccountingValueAddeddConfig", {
    method: "GET",
    params,
  });
}


/**
 * 修改单位应纳增值税项目与会计科目的关系
 * @param params
 */
export async function updateAccountingValueAddeddConfig(params: any) {
  return request("/api/ZyyjIms/finance/tax/updateAccountingValueAddeddConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
