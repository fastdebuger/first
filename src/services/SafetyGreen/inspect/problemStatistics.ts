import request from "@/utils/request";

/**
 * 查询问题分级统计
 * @param params
 */
export async function getProblemGradingStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getProblemGradingStatistics", {
    method: "GET",
    params,
  });
}


/**
 * 查询分公司问题分级统计
 * @param params
 */
export async function getSubProblemGradingStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getSubProblemGradingStatistics", {
    method: "GET",
    params,
  });
}


/**
 * 查询是否关闭统计
 * @param params
 */
export async function getIfCloseStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getIfCloseStatistics", {
    method: "GET",
    params,
  });
}


/**
 * 查询分公司、项目部问题统计
 * @param params
 */
export async function getBranchAndProjectStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getBranchAndProjectStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 查询问题归类统计
 * @param params
 */
export async function getProblemClassificationStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getProblemClassificationStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 查询问题分级统计
 * @param params
 */
export async function getProblemGradingLevelStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getProblemGradingLevelStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 获取违章单位下拉选项
 * @param params
 */
export async function getQualitySafetyInspectionObsName(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspectionObsName", {
    method: "GET",
    params,
  });
}

/**
 * 查询违章单位数据统计
 * @param params
 */
export async function getQualitySafetyInspectionObsNameStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspectionObsNameStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 查询专业系统问题统计
 * @param params
 */
export async function getQualitySafetyInspectionSystemBelongNameStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspectionSystemBelongNameStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 查询问题类别统计
 * @param params
 */
export async function getQualitySafetyInspectionProblemCategoryStatistics(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspectionProblemCategoryStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 查询问题发展趋势
 * @param params
 */
export async function getQualitySafetyInspectionProblemTrend(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyInspection/getQualitySafetyInspectionProblemTrend", {
    method: "GET",
    params,
  });
}











