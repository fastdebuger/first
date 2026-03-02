import request from "@/utils/request";

/**
 * 查询单据号配置
 * @param params
 */
export async function getSerialNumberConfig(params: any) {
  return request("/api/ZyyjIms/basic/SerialNumberConfig/getSerialNumberConfig", {
    method: "GET",
    params,
  });
}

/**
 * 新增单据号配置
 * @param params
 */
export async function addSerialNumberConfig(params: any) {
  return request("/api/ZyyjIms/basic/SerialNumberConfig/addSerialNumberConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改单据号配置
 * @param params
 */
export async function updateSerialNumberConfig(params: any) {
  return request("/api/ZyyjIms/basic/SerialNumberConfig/updateSerialNumberConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除单据号配置
 * @param params
 */
export async function deleteSerialNumberConfig(params: any) {
  return request("/api/ZyyjIms/basic/SerialNumberConfig/deleteSerialNumberConfig", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
