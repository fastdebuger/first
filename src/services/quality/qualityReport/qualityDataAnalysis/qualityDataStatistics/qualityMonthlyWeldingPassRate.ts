import request from "@/utils/request";

/**
 * 查询月度焊接一次合格率统计表
 * @param params
 */
export async function queryQualityMonthlyWeldingPassRateHead(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询月度焊接一次合格率统计表
 * @param params
 */
export async function queryQualityMonthlyWeldingPassRateBody(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询月度焊接一次合格率统计表
 * @param params
 */
export async function queryQualityMonthlyWeldingPassRateFlat(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyWeldingPassRate/queryQualityMonthlyWeldingPassRateFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增月度焊接一次合格率统计表
 * @param params
 */
export async function addQualityMonthlyWeldingPassRate(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyWeldingPassRate/addQualityMonthlyWeldingPassRate", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改月度焊接一次合格率统计表
 * @param params
 */
export async function updateQualityMonthlyWeldingPassRate(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyWeldingPassRate/updateQualityMonthlyWeldingPassRate", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除月度焊接一次合格率统计表
 * @param params
 */
export async function delQualityMonthlyWeldingPassRate(params: any) {
  return request("/api/ZyyjIms/quality/QualityMonthlyWeldingPassRate/delQualityMonthlyWeldingPassRate", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
