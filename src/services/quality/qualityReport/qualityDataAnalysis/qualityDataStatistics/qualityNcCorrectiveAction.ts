import request from "@/utils/request";

/**
 * 查询不合格项纠正措施记录
 * @param params
 */
export async function getQualityNcCorrectiveAction(params: any) {
  return request("/api/ZyyjIms/quality/QualityNcCorrectiveAction/getQualityNcCorrectiveAction", {
    method: "GET",
    params,
  });
}

/**
 * 新增不合格项纠正措施记录
 * @param params
 */
export async function addQualityNcCorrectiveAction(params: any) {
  return request("/api/ZyyjIms/quality/QualityNcCorrectiveAction/addQualityNcCorrectiveAction", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改不合格项纠正措施记录
 * @param params
 */
export async function updateQualityNcCorrectiveAction(params: any) {
  return request("/api/ZyyjIms/quality/QualityNcCorrectiveAction/updateQualityNcCorrectiveAction", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除不合格项纠正措施记录
 * @param params
 */
export async function deleteQualityNcCorrectiveAction(params: any) {
  return request("/api/ZyyjIms/quality/QualityNcCorrectiveAction/deleteQualityNcCorrectiveAction", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
