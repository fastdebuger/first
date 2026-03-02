import request from "@/utils/request";

/**
 * 查询用户待办信息
 * @param params
 */
export async function queryUserToDoInfo(params: any) {
  return request("/api/ZyyjIms/user/todo/queryUserToDoInfo", {
    method: "GET",
    params,
  });
}

/**
 * 下达风险事件收集信息任务
 * @param params
 */
export async function sendRiskEventsTask(params: any) {
  return request("/api/ZyyjIms/user/todo/sendRiskEventsTask", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 下达项目风险评估待办任务
 * @param params
 */
export async function sendRiskEvaluateTask(params: any) {
  return request("/api/ZyyjIms/user/todo/sendRiskEvaluateTask", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 下达重大经营风险评估待办任务
 * @param params
 */
export async function sendRiskAssessmentTask(params: any) {
  return request("/api/ZyyjIms/user/todo/sendRiskAssessmentTask", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
