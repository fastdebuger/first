import request from "@/utils/request";

/**
 * 查询讲师表
 * @param params
 */
export async function queryHrLecturer(params: any) {
  return request("/api/ZyyjIms/hr/lecturer/queryHrLecturer", {
    method: "GET",
    params,
  });
}


/**
 * 添加讲师表
 * @param params
 */
export async function addHrLecturer(params: any) {
  return request("/api/ZyyjIms/hr/lecturer/addHrLecturer", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改讲师表
 * @param params
 */
export async function updateHrLecturer(params: any) {
  return request("/api/ZyyjIms/hr/lecturer/updateHrLecturer", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除讲师表
 * @param params
 */
export async function delHrLecturer(params: any) {
  return request("/api/ZyyjIms/hr/lecturer/delHrLecturer", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入讲师表
 * @param params
 */
export async function importHrLecturer(params: any) {
  return request("/api/ZyyjIms/hr/lecturer/importHrLecturer", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}