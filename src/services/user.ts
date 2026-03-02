import request from '@/utils/request';
import type { LoginParamsType } from '@/services/login';

export interface UserParamsType {
  UserCode?: string;
}

/**
 * 获取当前用户的 默认信息 默认项目部 以及所包含的所以项目部
 * @param params
 */
export async function queryCurrent(params: UserParamsType) {
  const newParams = { ...params };
  return request('/api/basic/user/aut/getUserRelationData', {
    method: 'GET',
    params: newParams,
  });
}

/**
 * 查询wbs信息
 * @param params
 */
export async function queryWBS(params: any) {
  return request('/api/basic/user/aut/queryWbs', {
    method: 'GET',
    params,
  });
}

/**
 * 获取当前用户的所属项目部们
 * @param params
 */
export async function queryWbsByUser(params: any) {
  return request('/api/basic/user/aut/queryWbsByUser', {
    method: 'GET',
    params,
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

/**
 * 设置该用户所在项目部层级啊的默认项目部
 * @param params
 */
export async function setUserDefaultDep(params: LoginParamsType) {
  return request('/api/basic/aut/setUserDefaultDep', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 批量设置对应WBS以及在WBS中的角色
 * @param params
 */
export async function batchSetUserWbsAndDefaultDep(params: any) {
  return request('/api/basic/user/aut/batchSetUserWbsAndDefaultDep', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 获取用户动态路由
 * @param params
 */
export async function geneWebDynamicMenu(params: any) {
  return request('/api/basic/sys/aut/geneWebDynamicMenu', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询用户组的权限
 * @param params
 */
export async function queryUserGroupRight(params: any) {
  return request('/api/basic/user/aut/queryUserGroupRight', {
    method: 'GET',
    params,
  });
}

/**
 * 查询用户所在的wbs层级 用于切换项目部
 */
export async function queryWbsByUserCanSwitch(params: any) {
  return request('/api/basic/user/aut/queryWbsByUserCanSwitch', {
    method: 'GET',
    params,
  });
}

/**
 * 查询任务
 * @param params
 */
export async function querySysTaskInfo(params: any) {
  return request('/api/basic/sys/aut/querySysTaskInfo', {
    method: 'GET',
    params,
  });
}

/**
 * 查询列配置
 * @param params
 */
export async function queryColViewConfig(params: any) {
  return request('/api/basic/user/aut/queryColViewConfig', {
    method: 'GET',
    params,
  });
}

/**
 * 保存列配置
 * @param params
 */
export async function saveColViewConfig(params: any) {
  return request('/api/basic/user/aut/saveColViewConfig', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询用户组的权限
 * @param params
 */
export async function queryUserGroupRightEncrypt(params: any) {
  return request(`/api/basic/user/aut/queryUserGroupRightEncrypt`, {
    method: 'GET',
    params,
  });
}

/**
 * 查看所有用户
 * @param params
 */
export async function queryUserInfoInclude(params: any) {
  return request("/api/basicNew/user/aut/queryUserInfoInclude", {
    method: "GET",
    params,
  });
}

/**
 * 获取责任单位和具体违章单位名称
 * @param params
 */
export async function getObsCode(params: any) {
  return request("/api/ZyyjIms/basic/basic/getObsCode", {
    method: "GET",
    params,
  });
}

/**
 * 查询用户签字图片
 */
export async function queryUserElecSignature(params: any){
  return request("/api/basic/user/aut/queryUserElecSignature",{
    method: 'GET',
    params,
  })
}

/**
 * 获取用户关联信息
 * @param params
 */
export async function getUserRelationData(params: any) {
  return request('/api/basic/user/aut/getUserRelationData', {
    method: 'GET',
    params,
  });
}


/**
 * 设置所属默认项目部
 */
export async function batchSetUserDefaultDep(params: any) {
  return request('/api/basic/user/aut/batchSetUserDefaultDep', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 后端上传文件
 * @param params
 */
export async function uploadFile2Cloud(params: any) {
  return request(`/api/pipeWelding/basic/config/aut/uploadFile2Cloud`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 后端查看文件
 * @param params
 */
export async function downloadFileFormCloud(params: any) {
  return request(`/api/pipeWelding/basic/config/aut/downloadFileFormCloud`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
export async function downloadDirFileFormCloud(params: any) {
  return request(`/api/pipeWelding/basic/config/aut/downloadDirFileFormCloud`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改用户电子签章
 */
export async function updateUserElecSignature(params: any) {
  return request('/api/basic/user/aut/updateUserElecSignature', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
