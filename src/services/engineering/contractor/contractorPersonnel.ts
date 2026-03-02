import request from "@/utils/request";

/**
 * 查询承办商人员信息
 * @param params
 */
export async function getPersonInfo(params: any) {
  return request("/api/ZyyjIms/contractor/person/getPersonInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增承办商人员信息
 * @param params
 */
export async function addPersonInfo(params: any) {
  return request("/api/ZyyjIms/contractor/person/addPersonInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改承办商人员信息
 * @param params
 */
export async function updatePersonInfo(params: any) {
  return request("/api/ZyyjIms/contractor/person/updatePersonInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除承办商人员信息
 * @param params
 */
export async function deletePersonInfo(params: any) {
  return request("/api/ZyyjIms/contractor/person/deletePersonInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入承办商人员信息
 * @param params
 */
export async function importPersonInfo(params: any) {
  return request("/api/ZyyjIms/contractor/person/importPersonInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 拉黑人员
 * @param params
 */
export async function blockPerson(params: any) {
  return request("/api/ZyyjIms/contractor/person/blockPerson", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 人员黑名单审批通过或驳回 (公司级)
 * @param params
 */
export async function approvalPersonBlackList(params: any) {
  return request("/api/ZyyjIms/contractor/person/approvalPersonBlackList", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询合同信息
 * @param params
 */
export async function getcontractNoQuery(params: any) {
  return request("/api/ZyyjIms/contract/out/query", {
    method: "GET",
    params,
  });
}
/**
 * 查询合同信息
 * @param params
 */
export async function getPersonBlackList(params: any) {
  return request("/api/ZyyjIms/contractor/person/getPersonBlackList", {
    method: "GET",
    params,
  });
}

