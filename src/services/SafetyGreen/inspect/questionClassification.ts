import request from "@/utils/request";

/**
 * 查询问题归类配置
 * @param params
 */
export async function queryQualitySafetyFactorTypeHead(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyFactorType/queryQualitySafetyFactorTypeHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询问题归类配置
 * @param params
 */
export async function queryQualitySafetyFactorTypeBody(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyFactorType/queryQualitySafetyFactorTypeBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询问题归类配置
 * @param params
 */
export async function queryQualitySafetyFactorTypeFlat(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyFactorType/queryQualitySafetyFactorTypeFlat", {
    method: "GET",
    params,
  });
}
/**
 * 新增问题归类配置
 * @param params
 */
export async function addQualitySafetyFactorType(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyFactorType/addQualitySafetyFactorType", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改问题归类配置
 * @param params
 */
export async function updateQualitySafetyFactorType(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyFactorType/updateQualitySafetyFactorType", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除问题归类配置
 * @param params
 */
export async function delQualitySafetyFactorType(params: any) {
  return request("/api/ZyyjIms/qualitySafety/qualitySafetyFactorType/delQualitySafetyFactorType", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
