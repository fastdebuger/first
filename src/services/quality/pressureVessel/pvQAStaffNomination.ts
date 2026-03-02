import request from "@/utils/request";

/**
 * 查询压力容器质保体系责任人员推荐表
 * @param params
 */
export async function getHead(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/getHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询压力容器质保体系责任人员推荐表
 * @param params
 */
export async function getBody(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/getBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询压力容器质保体系责任人员推荐表
 * @param params
 */
export async function getFlat(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/getFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增压力容器质保体系责任人员推荐表
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改压力容器质保体系责任人员推荐表
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除压力容器质保体系责任人员推荐表
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 获取特种设备职务配置表信息
 * @param params
 */
export async function querySpecialEquipmentPostConfig(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/querySpecialEquipmentPostConfig", {
    method: "GET",
    params,
  });
}


/**
 * 修改压力容器质保体系责任人员推荐信息为审批中
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/pressureVessel/quality/personnelRecommend/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}