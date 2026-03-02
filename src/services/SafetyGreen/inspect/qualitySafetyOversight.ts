import request from "@/utils/request";

/**
 * 查询质量安全监督检查问题清单
 * @param params
 */
export async function getQualitySafetyInspection(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspection", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量安全监督检查问题清单
 * @param params
 */
export async function addQualitySafetyInspection(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/addQualitySafetyInspection", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量安全监督检查问题清单
 * @param params
 */
export async function updateQualitySafetyInspection(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/updateQualitySafetyInspection", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量安全监督检查问题清单
 * @param params
 */
export async function deleteQualitySafetyInspection(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/deleteQualitySafetyInspection", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入质量安全监督检查问题清单
 * @param params
 */
export async function importQualitySafetyInspection(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/importQualitySafetyInspection", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 下载质量安全监督检查问题清单模板
 * @param params
 */
export async function getTemplateZyyjIms(params: any) {
  return request("/api/ZyyjIms/template", {
    method: "GET",
    params,
  });
}


/**
 * 关闭质量安全监督检查问题清单
 * @param params
 */
export async function updateIfClose(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/updateIfClose", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量验证质量安全监督检查问题清单
 * @param params
 */
export async function updateBatchIsClose(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/updateBatchIsClose", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询作业行为详情
 * @param params
 */
export async function getSafetyInspectionItems(params: { id: string }) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getSafetyInspectionItems", {
    method: "GET",
    params,
  });
}

/**
 * 获取作业行为类数据统计
 * @param params
 */
export async function getDateProblemTypeStatistics(params: { mints?: number; maxts?: number; selectWbsCode?: string }) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getDateProblemTypeStatistics", {
    method: "GET",
    params,
  });
}


/**
 * 获取各单位 根据比例权重计算出得分
 * @param params
 */
export async function getBranchWeightNumRadioScore(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getBranchWeightNumRadioScore", {
    method: "GET",
    params,
  });
}

/**
 * 查询责任单位归属
 * @param params
 */
export async function getLiabilityAttributionH(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getLiabilityAttributionH", {
    method: "GET",
    params,
  });
}

/**
 * 查询具体违章单位名称
 * @param params
 */
export async function getLiabilityAttributionB(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getLiabilityAttributionB", {
    method: "GET",
    params,
  });
}

/**
 * 批量修改检查时间
 * @param params
 */
export async function updateBatchHourNum(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/updateBatchHourNum", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}







