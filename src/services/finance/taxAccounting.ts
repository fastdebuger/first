import request from "@/utils/request";

/**
 * 查询会计科目
 * @param params
 */
export async function queryTaxAccounting(params: any) {
  return request("/api/ZyyjIms/finance/tax/queryTaxAccounting", {
    method: "GET",
    params,
  });
}


/**
 * 添加会计科目
 * @param params
 */
export async function addTaxAccounting(params: any) {
  return request("/api/ZyyjIms/finance/tax/addTaxAccounting", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改会计科目
 * @param params
 */
export async function updateTaxAccounting(params: any) {
  return request("/api/ZyyjIms/finance/tax/updateTaxAccounting", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除会计科目
 * @param params
 */
export async function delTaxAccounting(params: any) {
  return request("/api/ZyyjIms/finance/tax/delTaxAccounting", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入会计科目
 * @param params
 */
export async function importTaxAccounting(params: any) {
  return request("/api/ZyyjIms/finance/tax/importTaxAccounting", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
