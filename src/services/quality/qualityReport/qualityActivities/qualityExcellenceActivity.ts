import request from "@/utils/request";

/**
 * 查询创优活动开展情况
 * @param params
 */
export async function getQualityExcellenceActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityExcellenceActivity/getQualityExcellenceActivity", {
    method: "GET",
    params,
  });
}

/**
 * 新增创优活动开展情况
 * @param params
 */
export async function addQualityExcellenceActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityExcellenceActivity/addQualityExcellenceActivity", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改创优活动开展情况
 * @param params
 */
export async function updateQualityExcellenceActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityExcellenceActivity/updateQualityExcellenceActivity", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除创优活动开展情况
 * @param params
 */
export async function deleteQualityExcellenceActivity(params: any) {
  return request("/api/ZyyjIms/quality/QualityExcellenceActivity/deleteQualityExcellenceActivity", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
