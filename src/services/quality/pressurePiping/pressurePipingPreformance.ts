import request from "@/utils/request";

/**
 * 查询压力管道施工业绩表
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/pressurePiping/construction/performance/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增压力管道施工业绩表
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/pressurePiping/construction/performance/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改压力管道施工业绩表
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/pressurePiping/construction/performance/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除压力管道施工业绩表
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/pressurePiping/construction/performance/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 修改压力管道施工业绩信息为审批中
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/pressurePiping/construction/performance/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}