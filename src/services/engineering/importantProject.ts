import request from "@/utils/request";

/**
 * 查询重点项目台账
 * @param params
 */
export async function getKeyProjectList(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getKeyProjectList", {
    method: "GET",
    params,
  });
}

/**
 * 新增重点项目台账
 * @param params
 */
export async function addKeyProjectList(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/addKeyProjectList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改重点项目台账
 * @param params
 */
export async function updateKeyProjectList(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/updateKeyProjectList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除重点项目台账
 * @param params
 */
export async function deleteKeyProjectList(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/deleteKeyProjectList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询重点项目统计
 * @param params
 */
export async function getKeyProjectStatistic(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getKeyProjectStatistic", {
    method: "GET",
    params,
  });
}

