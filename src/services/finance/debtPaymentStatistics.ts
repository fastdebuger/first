import request from "@/utils/request";

/**
 * 查询债务统计表
 * @param params
 */
export async function queryDebtPaymentStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debtPayment/queryDebtPaymentStatistics", {
    method: "GET",
    params,
  });
}


/**
 * 添加债务统计表
 * @param params
 */
export async function addDebtPaymentStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debtPayment/addDebtPaymentStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改债务统计表
 * @param params
 */
export async function updateDebtPaymentStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debtPayment/updateDebtPaymentStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除债务统计表
 * @param params
 */
export async function delDebtPaymentStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debtPayment/delDebtPaymentStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入债务统计表
 * @param params
 */
export async function importDebtPaymentStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debtPayment/importDebtPaymentStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
