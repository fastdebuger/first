import request from "@/utils/request";

/**
 * 查询课程信息
 * @param params
 */
export async function queryHrCourse(params: any) {
  return request("/api/ZyyjIms/hr/course/queryHrCourse", {
    method: "GET",
    params,
  });
}

/**
 * 查询课程分类树
 * @param params
 */
export async function queryWorkTypeTree(params: any) {
  return request("/api/ZyyjIms/hr/course/queryWorkTypeTree", {
    method: "GET",
    params,
  });
}


/**
 * 添加课程信息
 * @param params
 */
export async function addHrCourse(params: any) {
  return request("/api/ZyyjIms/hr/course/addHrCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改课程信息
 * @param params
 */
export async function updateHrCourse(params: any) {
  return request("/api/ZyyjIms/hr/course/updateHrCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除课程信息
 * @param params
 */
export async function delHrCourse(params: any) {
  return request("/api/ZyyjIms/hr/course/delHrCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入课程信息
 * @param params
 */
export async function importHrCourse(params: any) {
  return request("/api/ZyyjIms/hr/course/importHrCourse", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}



/**
 * 修改课程公开状态
 * @param params
 */
export async function updatePublicStatus(params: any) {
  return request("/api/ZyyjIms/hr/course/updatePublicStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
