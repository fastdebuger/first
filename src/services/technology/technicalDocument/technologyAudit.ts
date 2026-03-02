import request from "@/utils/request";

/**
 * 查询技术管理审计
 * @param params
 */
export async function getTechnologyBaseData(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyBaseData/getTechnologyBaseData", {
    method: "GET",
    params,
  });
}

/**
 * 新增技术管理审计
 * @param params
 */
export async function addTechnologyBaseData(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyBaseData/addTechnologyBaseData", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改技术管理审计
 * @param params
 */
export async function updateTechnologyBaseData(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyBaseData/updateTechnologyBaseData", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除技术管理审计
 * @param params
 */
export async function deleteTechnologyBaseData(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyBaseData/deleteTechnologyBaseData", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 发起技术管理审计审批
 * @param params
 */
export async function startApproval(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyBaseData/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 获取当前是否是填报时间
 * @param params
 */
export async function getIsCurrentDataMaintainable(params: any) {
  return request("/api/ZyyjIms/technology/maintainTimeConfig/getIsCurrentDataMaintainable", {
    method: "GET",
    params,
  });
}



