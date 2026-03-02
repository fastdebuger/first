import request from "@/utils/request";

/**
 * 查询课程资料
 * @param params
 */
export async function queryHrCourseMaterial(params: any) {
  return request("/api/ZyyjIms/hr/courseMaterial/queryHrCourseMaterial", {
    method: "GET",
    params,
  });
}


/**
 * 添加课程资料
 * @param params
 */
export async function addHrCourseMaterial(params: any) {
  return request("/api/ZyyjIms/hr/courseMaterial/addHrCourseMaterial", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改课程资料
 * @param params
 */
export async function updateHrCourseMaterial(params: any) {
  return request("/api/ZyyjIms/hr/courseMaterial/updateHrCourseMaterial", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除课程资料
 * @param params
 */
export async function delHrCourseMaterial(params: any) {
  return request("/api/ZyyjIms/hr/courseMaterial/delHrCourseMaterial", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入课程资料
 * @param params
 */
export async function importHrCourseMaterial(params: any) {
  return request("/api/ZyyjIms/hr/courseMaterial/importHrCourseMaterial", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 已转课件
 * @param params
 */
export async function translateIntoCourseware(params: any) {
  return request("/api/ZyyjIms/hr/courseMaterial/translateIntoCourseware", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


