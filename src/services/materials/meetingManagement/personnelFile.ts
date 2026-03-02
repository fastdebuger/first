import request from "@/utils/request";

/**
 * 查询人员档案
 * @param params
 */
export async function getPerson(params: any) {
  return request("/api/ZyyjIms/meeting/person/getPerson", {
    method: "GET",
    params,
  });
}

/**
 * 新增人员档案
 * @param params
 */
export async function addPerson(params: any) {
  return request("/api/ZyyjIms/meeting/person/addPerson", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改人员档案
 * @param params
 */
export async function updatePerson(params: any) {
  return request("/api/ZyyjIms/meeting/person/updatePerson", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除人员档案
 * @param params
 */
export async function deletePerson(params: any) {
  return request("/api/ZyyjIms/meeting/person/deletePerson", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
