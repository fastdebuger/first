import request from "@/utils/request";

/**
 * 查询公司风险评估调查表
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增公司风险评估调查表
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改公司风险评估调查表
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除公司风险评估调查表
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询年度公司重大经营风险评估调查配置表信息
 * @param params
 */
export async function queryAssessmentConfig(params: any) {
  return request("/api/ZyyjIms/risk/assessment/queryAssessmentConfig", {
    method: "GET",
    params,
  });
}

/**
 * 查询年度公司重大经营风险评估调查评估汇总
 * @param params
 */
export async function queryEvaluationSummary(params: any) {
  return request("/api/ZyyjIms/risk/assessment/queryEvaluationSummary", {
    method: "GET",
    params,
  });
}

/**
 * 新增年度公司重大经营风险评估调查信息
 * @param params
 */
export async function saveBatch(params: any) {
  // /ZyyjIms/risk/assessment/saveBatch
  return request("/api/ZyyjIms/risk/assessment/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询详情信息 - 编辑
 * @param params
 */
export async function queryAssessmentDetail(params: any) {
  return request("/api/ZyyjIms/risk/assessment/queryAssessmentDetail", {
    method: "GET",
    params,
  });
}

/**
 * 批量修改年度公司重大经营风险评估调查信息
 * @param params
 */
export async function updateBatch(params: any) {
  return request("/api/ZyyjIms/risk/assessment/updateBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
