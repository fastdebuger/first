import request from "@/utils/request";

/**
 * 查询培训班
 * @param params
 */
export async function queryHrTrainingClass(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/queryHrTrainingClass", {
    method: "GET",
    params,
  });
}


/**
 * 添加培训班
 * @param params
 */
export async function addHrTrainingClass(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/addHrTrainingClass", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改培训班
 * @param params
 */
export async function updateHrTrainingClass(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/updateHrTrainingClass", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除培训班
 * @param params
 */
export async function delHrTrainingClass(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/delHrTrainingClass", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入培训班
 * @param params
 */
export async function importHrTrainingClass(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/importHrTrainingClass", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询培训班课程及讲师信息
 * @param params
 */
export async function queryClassCourse(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/queryClassCourse", {
    method: "GET",
    params,
  });
}

/**
 * 配置培训班课程及讲师信息
 * @param params
 */
export async function configureCourse(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/configureCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询培训班学员信息
 * @param params
 */
export async function queryClassStudent(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/queryClassStudent", {
    method: "GET",
    params,
  });
}

/**
 * 配置培训班学员信息
 * @param params
 */
export async function configureStudent(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/configureStudent", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询当前用户参与未结束的培训班
 * @param params
 */
export async function queryClassForUse(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/queryClassForUse", {
    method: "GET",
    params,
  });
}
