import request from "@/utils/request";

/**
 * 查询项目周报
 * @param params
 */
export async function getWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getWeeklyReport", {
    method: "GET",
    params,
  });
}


export async function getProjectStageWeight(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getProjectStageWeight", {
    method: "GET",
    params,
  });
}

/**
 * 新增项目周报
 * @param params
 */
export async function addWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/addWeeklyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改项目周报
 * @param params
 */
export async function updateWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/updateWeeklyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除项目周报
 * @param params
 */
export async function deleteWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/deleteWeeklyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入项目周报
 * @param params
 */
export async function importWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/importWeeklyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 提交周报
 * @param params
 */
export async function addConfirmationRecord(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/addConfirmationRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询公司周报确认
 * @param params
 */
export async function getBranchConfirmationRecords(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getBranchConfirmationRecords", {
    method: "GET",
    params,
  });
}
/**
 * 查询最新的项目周报详情
 * @param params
 */
export async function getNewWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getNewWeeklyReport", {
    method: "GET",
    params,
  });
}
/**
 * 查询项目周报备选列表
 * @param params
 */
export async function getProjectBak(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getProjectBak", {
    method: "GET",
    params,
  });
}
/**
 * 查询当前项目周报详情
 * @param params
 */
export async function getWeeklyReportById(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getWeeklyReportById", {
    method: "GET",
    params,
  });
}

/**
 * 修改周报确认状态
 * @param params
 */
export async function updateConfirmationRecord(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/updateConfirmationRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}



/**
 * 查询本周新增项目
 * @param params
 */
export async function getCurrWeekNewWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getCurrWeekNewWeeklyReport", {
    method: "GET",
    params,
  });
}

/**
 * 查询本周完工项目
 * @param params
 */
export async function getCurrWeekCompleteWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getCurrWeekCompleteWeeklyReport", {
    method: "GET",
    params,
  });
}

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
 * 查询重点项目统计
 * @param params
 */
export async function getKeyProjectStatistic(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getKeyProjectStatistic", {
    method: "GET",
    params,
  });
}

/**
 * 查询项目上周周报详情
 * @param params
 */
export async function getLastWeeklyReport(params: any) {
  return request("/api/ZyyjIms/engineering/weeklyReport/getLastWeeklyReport", {
    method: "GET",
    params,
  });
}

