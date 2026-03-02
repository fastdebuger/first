import request from "@/utils/request";

/**
 * 查询损益预测
 * @param params
 */
export async function queryPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryPredictReportItems", {
    method: "GET",
    params,
  });
}

export async function queryCompanyPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryCompanyPredictReportItems", {
    method: "GET",
    params,
  });
}


export async function querySubCompanyPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/querySubCompanyPredictReportItems", {
    method: "GET",
    params,
  });
}


export async function queryDepPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryDepPredictReportItems", {
    method: "GET",
    params,
  });
}


export async function queryDepDiffVersionPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/queryDepDiffVersionPredictReportItems", {
    method: "GET",
    params,
  });
}




/**
 * 添加损益预测
 * @param params
 */
export async function addPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/addPredictReportItems", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改损益预测
 * @param params
 */
export async function updatePredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/updatePredictReportItems", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除损益预测
 * @param params
 */
export async function delPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/delPredictReportItems", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入损益预测
 * @param params
 */
export async function importPredictReportItems(params: any) {
  return request("/api/ZyyjIms/finance/profitLoss/importPredictReportItems", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
