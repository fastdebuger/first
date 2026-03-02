import request from "@/utils/request";

/**
 * 查询记分人员信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/quality/scoringPersonnel/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增记分人员信息
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/quality/scoringPersonnel/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改记分人员信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/quality/scoringPersonnel/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除记分人员信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/quality/scoringPersonnel/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
