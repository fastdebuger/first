import request from "@/utils/request";


/**
 * 查询法律法规最新版本列表
 * @param params
 */
export async function getNewLawInfo(params: any) {
  return request("/api/ZyyjIms/legislation/info/getNewLawInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增法律信息 - 待提交
 * @param params
 */
export async function addLawInfo(params: any) {
  return request("/api/ZyyjIms/legislation/info/addLawInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改法律信息为审批中
 * @param params
 */
export async function sendLawApproval(params: any) {
  return request("/api/ZyyjIms/legislation/info/sendLawApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询历史全部版本
 * @param params
 */
export async function queryAllLawList(params: any) {
  return request("/api/ZyyjIms/legislation/info/queryAllLawList", {
    method: "GET",
    params,
  });
}

/**
 * 导入法律信息
 * @param params
 */
export async function importLawInfo(params: any) {
  return request("/api/ZyyjIms/legislation/info/importLawInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 法律版本迭代
 * @param params
 */
export async function updateLawVersion(params: any) {
  return request("/api/ZyyjIms/legislation/info/updateLawVersion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 法律版本迭代
 * @param params
 */
export async function updateLawInfo(params: any) {
  return request("/api/ZyyjIms/legislation/info/updateLawInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 法律版本迭代
 * @param params
 */
export async function delLawInfo(params: any) {
  return request("/api/ZyyjIms/legislation/info/delLawInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询连续安全工日
 * @param params
 */
export async function querylegislationInfoSafetyWorkDay(params: any) {
  return request("/api/ZyyjIms/legislation/info/safety/work/day", {
    method: "GET",
    params,
  });
}

/**
 * 查询连续安全工日
 * @param params
 */
export async function getWorkDay(params: any) {
  return request("/api/ZyyjIms/workSafety/hour/config/getWorkDay", {
    method: "GET",
    params,
  });
}

/**
 * 新增查询连续安全工日
 * @param params
 */
export async function saveWorkDay(params: any) {
  return request("/api/ZyyjIms/workSafety/hour/config/saveWorkDay", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 编辑查询连续安全工日
 * @param params
 */
export async function updateWorkDay(params: any) {
  return request("/api/ZyyjIms/workSafety/hour/config/updateWorkDay", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询年度安全工时配置
 * @param params
 */
export async function getWorkAnnual(params: any) {
  return request("/api/ZyyjIms/workSafety/annual/config/getWorkAnnual", {
    method: "GET",
    params,
  });
}

/**
 * 新增年度安全工时配置
 * @param params
 */
export async function saveWorkAnnual(params: any) {
  return request("/api/ZyyjIms/workSafety/annual/config/saveWorkAnnual", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改年度安全工时配置
 * @param params
 */
export async function updateWorkAnnual(params: any) {
  return request("/api/ZyyjIms/workSafety/annual/config/updateWorkAnnual", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 批量保存HSE法律法规信息
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/legislation/info/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}