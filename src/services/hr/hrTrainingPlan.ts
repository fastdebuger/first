import request from "@/utils/request";

/**
 * 查询培训计划
 * @param params
 */
export async function queryHrTrainingPlan(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/queryHrTrainingPlan", {
    method: "GET",
    params,
  });
}


/**
 * 添加培训计划
 * @param params
 */
export async function addHrTrainingPlan(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/addHrTrainingPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改培训计划
 * @param params
 */
export async function updateHrTrainingPlan(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/updateHrTrainingPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除培训计划
 * @param params
 */
export async function delHrTrainingPlan(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/delHrTrainingPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入培训计划
 * @param params
 */
export async function importHrTrainingPlan(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/importHrTrainingPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 发布培训计划
 * @param params
 */
export async function publishHrTrainingPlan(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/publishHrTrainingPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询培训班课程签到状态
 * @param params
 */
export async function getIsNeedSign(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/getIsNeedSign", {
    method: "GET",
    params,
  });
}

/**
 * 查询培训班课程签到状态
 * @param params
 */
export async function courseSign(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/courseSign", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询培训班课程签到信息
 * @param params
 */
export async function queryCourseSign(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/queryCourseSign", {
    method: "GET",
    params,
  });
}
