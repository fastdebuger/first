import request from "@/utils/request";

/**
 * 查询年度重大风险评估填报时间配置表信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/dateConfig/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增年度重大风险评估填报时间配置表信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/dateConfig/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改年度重大风险评估填报时间配置表信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/dateConfig/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除年度重大风险评估填报时间配置表信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/risk/assessment/dateConfig/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
