import request from "@/utils/request";

/**
 * 查询投标报价管理
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/bid/offer/manage/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增投标报价管理
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/bid/offer/manage/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改投标报价管理
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/bid/offer/manage/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除投标报价管理
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/bid/offer/manage/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
