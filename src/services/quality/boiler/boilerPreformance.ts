import request from "@/utils/request";

/**
 * 查询锅炉施工业绩表
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/boiler/construction/performance/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增锅炉施工业绩表
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/boiler/construction/performance/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改锅炉施工业绩表
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/boiler/construction/performance/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除锅炉施工业绩表
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/boiler/construction/performance/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 修改锅炉施工业绩信息为审批中
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/boiler/construction/performance/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}