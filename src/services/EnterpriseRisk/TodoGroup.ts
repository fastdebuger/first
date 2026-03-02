import request from "@/utils/request";

/**
 * 查询用户分组
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/user/todo/group/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增用户分组
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/user/todo/group/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改用户分组
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/user/todo/group/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除用户分组
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/user/todo/group/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
