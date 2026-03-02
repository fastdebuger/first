import request from "@/utils/request";


/**
 * 新增风险类别配置类信息
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/riskCategory/config/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改风险类别配置类信息
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/riskCategory/config/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询风险类别配置类信息
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/riskCategory/config/getInfo", {
    method: "GET",
    params,
  });
}



/**
 * 删除风险类别配置类信息
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/riskCategory/config/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
