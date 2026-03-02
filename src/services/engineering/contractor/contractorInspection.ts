import request from "@/utils/request";

/**
 * 查询承包商施工作业过程中监督检查表信息
 * @param params
 */
export async function queryMonthlyOutput(params: any) {
  return request("/api/ZyyjIms/contractor/inspection/queryMonthlyOutput", {
    method: "GET",
    params,
  });
}

/**
 * 新增承包商施工作业过程中监督检查表信息
 * @param params
 */
export async function addMonthlyOutput(params: any) {
  return request("/api/ZyyjIms/contractor/inspection/addMonthlyOutput", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改承包商施工作业过程中监督检查表信息
 * @param params
 */
export async function updateMonthlyOutput(params: any) {
  return request("/api/ZyyjIms/contractor/inspection/updateMonthlyOutput", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除承包商施工作业过程中监督检查表信息
 * @param params
 */
export async function delMonthlyOutput(params: any) {
  return request("/api/ZyyjIms/contractor/inspection/delMonthlyOutput", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询承包商施工作业过程中监督检查表详情信息
 * @param params
 */
export async function queryMonthlyOutputDetail(params: any) {
  return request("/api/ZyyjIms/contractor/inspection/queryMonthlyOutputDetail", {
    method: "GET",
    params,
  });
}

/**
 * 获取承包商施工作业过程中监督检查表配置信息
 * @param params
 */
export async function getExaminationConfig(params: any) {
  return request("/api/ZyyjIms/contractor/examination/getConfig", {
    method: "GET",
    params,
  });
}
/**
 * 获取监督检查表提示信息
 * @param params
 */
export async function getRemindInfo(params: any) {
  return request("/api/ZyyjIms/contractor/inspection/getRemindInfo", {
    method: "GET",
    params,
  });
}