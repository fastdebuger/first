import request from "@/utils/request";

/**
 * 查询质量体系运行情况
 * @param params
 */
export async function getQualitySystemOperation(params: any) {
  return request("/api/ZyyjIms/quality/QualitySystemOperation/getQualitySystemOperation", {
    method: "GET",
    params,
  });
}

/**
 * 新增质量体系运行情况
 * @param params
 */
export async function addQualitySystemOperation(params: any) {
  return request("/api/ZyyjIms/quality/QualitySystemOperation/addQualitySystemOperation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量体系运行情况
 * @param params
 */
export async function updateQualitySystemOperation(params: any) {
  return request("/api/ZyyjIms/quality/QualitySystemOperation/updateQualitySystemOperation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量体系运行情况
 * @param params
 */
export async function deleteQualitySystemOperation(params: any) {
  return request("/api/ZyyjIms/quality/QualitySystemOperation/deleteQualitySystemOperation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
