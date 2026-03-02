import request from "@/utils/request";

/**
 * 查询归档清单
 * @param params
 */
export async function queryTechnologyArchiveListHead(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/queryTechnologyArchiveListHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询归档清单
 * @param params
 */
export async function queryTechnologyArchiveListBody(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/queryTechnologyArchiveListBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询归档清单
 * @param params
 */
export async function queryTechnologyArchiveListFlat(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/queryTechnologyArchiveListFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增归档清单
 * @param params
 */
export async function addTechnologyArchiveList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/addTechnologyArchiveList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改归档清单
 * @param params
 */
export async function updateTechnologyArchiveList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/updateTechnologyArchiveList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除归档清单
 * @param params
 */
export async function delTechnologyArchiveList(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/delTechnologyArchiveList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 发起归档清单审批
 * @param params
 */
export async function startApproval(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询交工资料归档统计
 * @param params
 */
export async function queryTechnologyArchiveListStatistics(params: any) {
  return request("/api/ZyyjIms/technology/TechnologyArchiveList/queryTechnologyArchiveListStatistics", {
    method: "GET",
    params,
  });
}






