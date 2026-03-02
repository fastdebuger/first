import request from "@/utils/request";

/**
 * 查询承包商年度评价基本信息
 * @param params
 */
export async function getAppraiseInfo(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getAppraiseInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增承包商年度评价基本信息
 * @param params
 */
export async function addAppraiseByYear(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/addAppraiseByYear", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改承包商年度评价基本信息
 * @param params
 */
export async function updateAppraiseByYear(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/updateAppraiseByYear", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除承包商年度评价基本信息
 * @param params
 */
export async function delAppraiseByYear(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/delAppraiseByYear", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 承包商年度评价基本信息详情
 * @param params
 */
export async function getAppraiseDetail(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getAppraiseDetail", {
    method: "GET",
    params,
  });
}

/**
 * 获取承包商基本条件评价配置信息
 * @param params
 */
export async function getBasicConfig(params: any) {
  return request("/api/ZyyjIms/contractor/basic/getConfig", {
    method: "GET",
    params,
  });
}

/**
 * 获取承包商业绩评价配置表信息
 * @param params
 */
export async function getPerformanceConfig(params: any) {
  return request("/api/ZyyjIms/contractor/performance/getConfig", {
    method: "GET",
    params,
  });
}
/**
 * 项目部层级查询承包商年度评价列表
 * @param params
 */
export async function getDepYearInfoList(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getDepYearInfoList", {
    method: "GET",
    params,
  });
}
/**
 * 项目部查询各合同打分情况
 * @param params
 */
export async function getScore(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getContractScore", {
    method: "GET",
    params,
  });
}
/**
 * 新增支出合同打分信息
 * @param params
 */
export async function addOutContractScoreInfo(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/addOutContractScoreInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询合同的打分信息
 * @param params
 */
export async function getScoreRecordInfo(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getScoreRecordInfo", {
    method: "GET",
    params,
  });
}
/**
 * 修改支出合同打分信息
 * @param params
 */
export async function updateOutContractScoreInfo(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/updateOutContractScoreInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改支出合同打分信息
 * @param params
 */
export async function publishScoreDep(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/publishScoreDep", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改支出合同打分信息
 * @param params
 */
export async function updateContractorInfo(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/updateContractorInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 根据承包商名称查询承包商基础信息
 * @param params
 */
export async function getContractorBasicInfo(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getContractorBasicInfo", {
    method: "GET",
    params,
  });
}
/**
 * 分公司层级查询承包商年度评价列表
 * @param params
 */
export async function getBranchCompYearInfoList(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getBranchCompYearInfoList", {
    method: "GET",
    params,
  });
}
/**
 * 公司层级查询承包商年度评价列表
 * @param params
 */
export async function getCompYearInfoList(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getCompYearInfoList", {
    method: "GET",
    params,
  });
}
/**
 * 分公司查询各项目打分情况
 * @param params
 */
export async function getDepScore(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getDepScore", {
    method: "GET",
    params,
  });
}
/**
 * 公司查询各项目打分情况
 * @param params
 */
export async function getBranchCompScore(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/getBranchCompScore", {
    method: "GET",
    params,
  });
}
/**
 * 分公司对承包商打分
 * @param params
 */
export async function branchCompEvaluate(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/branchCompEvaluate", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 公司对承包商打分
 * @param params
 */
export async function compEvaluate(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/compEvaluate", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 分公司对承包商打分信息发布
 * @param params
 */
export async function publishScoreBranch(params: any) {
  return request("/api/ZyyjIms/contractor/appraiseByYear/publishScoreBranch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}