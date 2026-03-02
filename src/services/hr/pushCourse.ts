import request from "@/utils/request";

/**
 * 查询推送课程
 * @param params
 */
export async function queryPushCourseConfigList(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/queryPushCourseConfigList", {
    method: "GET",
    params,
  });
}

/**
 * 新增推送课程
 * @param params
 */
export async function addPushCourse(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/addPushCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改推送课程
 * @param params
 */
export async function updatePushCourse(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/updatePushCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除推送课程
 * @param params
 */
export async function deletePushCourse(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/deletePushCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 推送课程
 * @param params
 */
export async function pushCourse(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/pushCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询学习课程列表
 * @param params
 */
export async function queryPushCourseList(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/queryPushCourseList", {
    method: "GET",
    params,
  });
}
/**
 * 查询学习课程记录
 * @param params
 */
export async function queryPushCourseRecordList(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/queryPushCourseRecordList", {
    method: "GET",
    params,
  });
}

/**
 * 更新课程学习时间
 * @param params
 */
export async function updateCourseStudyTime(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/updateCourseStudyTime", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 更新课程学习状态
 * @param params
 */
export async function updateStudyStatus(params: any) {
  return request("/api/ZyyjIms/hr/pushCourse/updateStudyStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
