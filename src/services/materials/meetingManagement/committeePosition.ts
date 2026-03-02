import request from "@/utils/request";

/**
 * 查询委员会职务档案信息
 * @param params
 */
export async function getPosition(params: any) {
  return request("/api/ZyyjIms/meeting/committee/getPosition", {
    method: "GET",
    params,
  });
}

/**
 * 新增委员会职务档案信息
 * @param params
 */
export async function addPosition(params: any) {
  return request("/api/ZyyjIms/meeting/committee/addPosition", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改委员会职务档案信息
 * @param params
 */
export async function updatePosition(params: any) {
  return request("/api/ZyyjIms/meeting/committee/updatePosition", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除委员会职务档案信息
 * @param params
 */
export async function deletePosition(params: any) {
  return request("/api/ZyyjIms/meeting/committee/deletePosition", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
