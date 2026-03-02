import request from "@/utils/request";

/**
 * 查询入库炉批号
 * @param params
 */
export async function queryInStorageBatchCode(params: any) {
  return request("/api/ZyyjIms/basic/jiaBuss/inStorage/queryInStorageBatchCode", {
    method: "GET",
    params,
  });
}

