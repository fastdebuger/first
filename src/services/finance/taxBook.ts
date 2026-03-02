import request from "@/utils/request";
import TaxStatistics from "src/pages/Finance/Tax/TaxStatistics";

/**
 * 查询税金台账
 * @param params
 */
export async function queryTaxBook(params: any) {
  return request("/api/ZyyjIms/finance/tax/queryTaxBook", {
    method: "GET",
    params,
  });
}

/**
 * 进销平衡台账
 * @param params
 */
export async function queryTaxStatistics(params: any) {
  return request("/api/ZyyjIms/finance/tax/queryTaxStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 添加税金台账
 * @param params
 */
export async function addTaxBook(params: any) {
  return request("/api/ZyyjIms/finance/tax/addTaxBook", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改税金台账
 * @param params
 */
export async function updateTaxBook(params: any) {
  return request("/api/ZyyjIms/finance/tax/updateTaxBook", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除税金台账
 * @param params
 */
export async function delTaxBook(params: any) {
  return request("/api/ZyyjIms/finance/tax/delTaxBook", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入税金台账
 * @param params
 */
export async function importTaxBook(params: any) {
  return request("/api/ZyyjIms/finance/tax/importTaxBook", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
