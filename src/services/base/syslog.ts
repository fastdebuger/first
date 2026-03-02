import request from "@/utils/request";

/**
 * 查询系统日志
 * @param params
 */
export async function queryMaterialSysLog(params: any) {
  return request("/api/ZyyjIms/basic/report/queryMaterialSysLog", {
    method: "GET",
    params,
  });
}

