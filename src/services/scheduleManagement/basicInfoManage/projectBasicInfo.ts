import request from "@/utils/request";

/**
 * 查询项目基本信息列表
 * @param params
 */
export async function getProjectBaseInfoList(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/getProjectBaseInfoList", {
    method: "GET",
    params,
  });
}

/**
 * 添加项目基本信息
 * @param params
 */
export async function addProjectBaseInfo(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/addProjectBaseInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改项目基本信息
 * @param params
 */
export async function updateProjectBaseInfo(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/updateProjectBaseInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除项目基本信息
 * @param params
 */
export async function deleteProjectBaseInfo(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/deleteProjectBaseInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询项目基本信息详情
 * @param params
 */
export async function getProjectBaseInfoDetail(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/getProjectBaseInfoDetail", {
    method: "GET",
    params,
  });
}
/**
 * 查询项目基本信息详情
 * @param params
 */
export async function getAreaDictTree(params: any) {
  return request("/api/ZyyjIms/engineering/dict/getAreaDictTree", {
    method: "GET",
    params,
  });
}
/**
 * 查询三新分类字典
 * @param params
 */
export async function getThreeNewCategoryDictTree(params: any) {
  return request("/api/ZyyjIms/engineering/dict/getThreeNewCategoryDictTree", {
    method: "GET",
    params,
  });
}

/**
 * 导入项目基本信息
 * @param params
 */
export async function importProjectBaseInfo(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/importProjectBaseInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 下载导入模板
 * @param params
 */
export async function getTemplateDownloadUrl(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/getTemplateDownloadUrl", {
    method: "GET",
    params,
  });
}

/**
 * 发起审批
 * @param params
 */
export async function startApproval(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
