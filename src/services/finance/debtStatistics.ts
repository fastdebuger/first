import request from "@/utils/request";

/**
 * 查询债权统计表
 * @param params
 */
export async function queryDebtStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debt/queryDebtStatistics", {
    method: "GET",
    params,
  });
}


/**
 * 添加债权统计表
 * @param params
 */
export async function addDebtStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debt/addDebtStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改债权统计表
 * @param params
 */
export async function updateDebtStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debt/updateDebtStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除债权统计表
 * @param params
 */
export async function delDebtStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debt/delDebtStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入债权统计表
 * @param params
 */
export async function importDebtStatistics(params: any) {
  return request("/api/ZyyjIms/finance/debt/importDebtStatistics", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询利润中心编码
 * @param params
 */
export async function queryProfitCenter(params: any) {
  return request("/api/ZyyjIms/finance/base/queryProfitCenter", {
    method: "GET",
    params,
  });
}

/**
 * 获取净债权资金预测
 * @param params
 */
export async function getNetCreditFundForecast(params: any) {
  return request("/api/ZyyjIms/finance/debt/getNetCreditFundForecast", {
    method: "GET",
    params,
  });
}

/**
 * 更新净债权资金预测
 * @param params
 */
export async function updateNetCreditFundForecast(params: any) {
  return request("/api/ZyyjIms/finance/debt/updateNetCreditFundForecast", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
