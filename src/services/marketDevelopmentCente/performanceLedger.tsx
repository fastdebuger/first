import request from "@/utils/request";

/**
 * 查询公司业绩台账
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/bid/company/performance/ledger/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增公司业绩台账
 * @param params
 */
export async function saveBatch(params: any) {
  return request("/api/ZyyjIms/bid/company/performance/ledger/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改公司业绩台账
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/bid/company/performance/ledger/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除公司业绩台账
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/bid/company/performance/ledger/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
