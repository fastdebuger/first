import request from '@/utils/request';
import type { LoginParamsType } from '@/services/login';

export interface BaseUserListType {
  depCode: string;
  sort: string;
  order: string;
}

/**
 * 获取用户信息
 * @param params
 */
export async function queryUser(params: any) {
  return request('/api/basic/user/aut/queryUser', {
    method: 'GET',
    params,
  });
}

/**
 * 查询用户菜单权限
 */
export async function queryUserHaveModuleRight(params: any) {
  return request('/api/basic/sys/aut/queryUserHaveModuleRight', {
    method: 'GET',
    params,
  });
}

/**
 * 获取用户信息
 * @param params
 */
export async function querySubWbsUser(params: BaseUserListType) {
  return request('/api/basic/user/aut/querySubWbsUser', {
    method: 'GET',
    params,
  });
}

/**
 * 获取用户关联信息
 * @param params
 */
export async function getUserRelationData(params: BaseUserListType) {
  return request('/api/basic/user/aut/getUserRelationData', {
    method: 'GET',
    params,
  });
}

/**
 * 获取用户在所属WBS中的权限
 * @param params
 */
export async function getUserWbsRight(params: any) {
  return request('/api/basic/user/aut/getUserWbsRight', {
    method: 'GET',
    params,
  });
}

/**
 * 新增用户信息
 * @param params
 */
export async function addUser(params: LoginParamsType) {
  return request('/api/basic/user/aut/addUser', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改用户信息
 * @param params
 */
export async function updateUser(params: LoginParamsType) {
  return request('/api/basic/user/aut/updateUser', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 删除用户
 * @param params
 */
export async function deleteUser(params: LoginParamsType) {
  return request('/api/basic/user/aut/deleteUser', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 为用户设置对应WBS以及在WBS中的角色(角色可以多选)，并设置默认项目部
 * @param params
 */
export async function setUserWbsAndDefaultDep(params: LoginParamsType) {
  return request('/api/basic/user/aut/setUserWbsAndDefaultDep', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询用户所属的装置、单位工程、单元
 * @param params
 */
export async function queryUserAscriptionDevAndUnit(params: BaseUserListType) {
  return request('/api/pipeWelding/basic/config/aut/queryUserAscriptionDevAndUnit', {
    method: 'GET',
    params,
  });
}

/**
 * 查询权限装置
 * @param params
 */
export async function queryUserAscriptionDev(params: BaseUserListType) {
  return request('/api/pipeWelding/basic/config/aut/queryUserAscriptionDev', {
    method: 'GET',
    params,
  });
}

/**
 * 根据funccode和权限获取用户
 * @param params
 */
export async function queryUserByFuncCodeAndRight(params: BaseUserListType) {
  return request('/api/basic/user/aut/queryUserByFuncCodeAndRight', {
    method: 'GET',
    params,
  });
}

/**
 * 根据funccode和能力获取用户
 * @param params
 */
export async function queryUserByFuncAbility(params: BaseUserListType) {
  return request('/api/basic/sys/aut/queryUserByFuncAbility', {
    method: 'GET',
    params,
  });
}

/**
 * 重置密码
 * @param params
 */
export async function initUserPwd(params: BaseUserListType) {
  return request('/api/basic/user/aut/initUserPwd', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 获取用户信息
 * @param params
 */
export async function queryUserInfo(params: any) {
  return request('/api/basic/user/aut/queryUserInfo', {
    method: 'GET',
    params,
  });
}
