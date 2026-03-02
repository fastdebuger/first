import request from "@/utils/request";

/**
 * 新增工程项目主要风险监控登记信息
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量保存风险分析/ 评价表信息
 * @param params
 */
export async function saveBatchRiskAnalysis(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/saveBatchRiskAnalysis", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量保存风险应对表信息
 * @param params
 */
export async function saveBatchRiskAnswer(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/saveBatchRiskAnswer", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量保存监督检查信息
 * @param params
 */
export async function saveBatchRiskExamine(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/saveBatchRiskExamine", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 修改工程项目主要风险监控登记信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除工程项目主要风险监控登记信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 获取工程项目主要风险监控登记表信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/getInfo", {
    method: "GET",
    params,
  });
}


/**
 * 获取概要信息
 * @param params
 */
export async function queryMainInfo(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/queryMainInfo", {
    method: "GET",
    params,
  });
}



/**
 * 查询已填报风险管控工程名称列表
 * @param params
 */
export async function queryRiskMonitoringProjectName(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/queryRiskMonitoringProjectName", {
    method: "GET",
    params,
  });
}


/**
 * 查询风险分析评估信息
 * @param params
 */
export async function queryRiskAnalysisInfo(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/queryRiskAnalysisInfo", {
    method: "GET",
    params,
  });
}



/**
 * 查询风险分析评估最终结果信息
 * @param params
 */
export async function queryRiskAnalysisResultInfo(params: any) {
  return request("/api/ZyyjIms/risk/monitoring/project/queryRiskAnalysisResultInfo", {
    method: "GET",
    params,
  });
}