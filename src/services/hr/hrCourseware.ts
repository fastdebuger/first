import request from "@/utils/request";

/**
 * 查询课件表
 * @param params
 */
export async function queryHrCourseware(params: any) {
  return request("/api/ZyyjIms/hr/courseware/queryHrCourseware", {
    method: "GET",
    params,
  });
}


/**
 * 添加课件表
 * @param params
 */
export async function addHrCourseware(params: any) {
  return request("/api/ZyyjIms/hr/courseware/addHrCourseware", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改课件表
 * @param params
 */
export async function updateHrCourseware(params: any) {
  return request("/api/ZyyjIms/hr/courseware/updateHrCourseware", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除课件表
 * @param params
 */
export async function delHrCourseware(params: any) {
  return request("/api/ZyyjIms/hr/courseware/delHrCourseware", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入课件表
 * @param params
 */
export async function importHrCourseware(params: any) {
  return request("/api/ZyyjIms/hr/courseware/importHrCourseware", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}