import request from "@/utils/request";

/**
 * 查询项目月报
 * @param params
 */
export async function getMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getMonthlyReport", {
    method: "GET",
    params,
  });
}

/**
 * 新增项目月报
 * @param params
 */
export async function addMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/addMonthlyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改项目月报
 * @param params
 */
export async function updateMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/updateMonthlyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除项目月报
 * @param params
 */
export async function deleteMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/deleteMonthlyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入项目月报
 * @param params
 */
export async function importMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/importMonthlyReport", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 提交月报
 * @param params
 */
export async function addConfirmationRecord(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/addConfirmationRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


export async function getCompConfirmationRecords(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getCompConfirmationRecords", {
    method: "GET",
    params,
  });
}

/**
 * 查询当前项目月报详情
 * @param params
 */
export async function getMonthlyReportById(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getMonthlyReportById", {
    method: "GET",
    params,
  });
}
/**
 * 查询最新的项目月报详情
 * @param params
 */
export async function getNewMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getNewMonthlyReport", {
    method: "GET",
    params,
  });
}
/**
 * 查询项目月报报备选列表
 * @param params
 */
export async function getProjectBak(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getProjectBak", {
    method: "GET",
    params,
  });
}

/**
 * 修改月报确认状态
 * @param params
 */
export async function updateConfirmationRecord(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/updateConfirmationRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询项目上月月报详情
 * @param params
 */
export async function getLastMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getLastMonthlyReport", {
    method: "GET",
    params,
  });
}




/**
 * 查询本月新增项目
 * @param params
 */
export async function getCurrMonthNewMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getCurrMonthNewMonthlyReport", {
    method: "GET",
    params,
  });
}



/**
 * 查询本月完工项目
 * @param params
 */
export async function getCurrMonthCompleteMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getCurrMonthCompleteMonthlyReport", {
    method: "GET",
    params,
  });
}

/**
 * 查询合同项目部
 * @param params
 */
export async function getDepByContractNo(params: any) {
  return request("/api/ZyyjIms/engineering/monthlyReport/getDepByContractNo", {
    method: "GET",
    params,
  });
}
