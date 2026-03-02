import request from '@/utils/request';

export interface BaseUserGroupListType {
  depCode: string;
  GroupCode?: string;
}
export interface BaseUserGroupAddAndModify {
  group_code: number;
  group_name: string;
  remark?: string;
}
export interface BaseUserGroupDelete {
  group_code: number;
}
// export interface BaseUserGroupRightAdd {
//   group_code: number;
// }
/**
 * 获取 用户组的信息
 * @param params
 */
export async function queryUserGroup(params: BaseUserGroupListType) {
  return request('/api/basic/user/aut/queryUserGroup', {
    method: 'GET',
    params,
  });
}

/**
 * 根据装置类型查询用户组权限
 * @param params
 */
export async function queryUserGroupRightByDevTypeCode(params: any) {
  return request('/api/basic/user/aut/queryUserGroupRightByDevTypeCode', {
    method: 'GET',
    params,
  });
}

/**
 * 新增 用户组
 * @param params
 */
export async function AddUserGroup(params: BaseUserGroupAddAndModify) {
  return request('/api/basic/user/aut/addUserGroup', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 删除用户组
 * @param params
 */
export async function DeleteUserGroup(params: BaseUserGroupDelete) {
  return request('/api/basic/user/aut/deleteUserGroup', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 修改用户组
 * @param params
 */
export async function ModifyUserGroup(params: BaseUserGroupAddAndModify) {
  return request('/api/basic/user/aut/updateUserGroup', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 获取系统的功能列表
 */
export async function querySysFuncList() {
  return request('/api/basic/sys/aut/querySysFuncList', {
    method: 'GET',
  });
}

/**
 * 获取该用户已经配置的权限数据
 * @param params
 */
export async function queryUserGroupRight(params: any) {
  return request(`/api/basic/user/aut/queryUserGroupRight`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取该用户已经配置的权限数据
 * @param params
 */
export async function queryCompUserGroupRight(params: any) {
  return request(`/api/basic/user/aut/queryCompUserGroupRight`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取该用户已经配置的权限数据
 * @param params
 */
export async function addUserGroupRight(params: BaseUserGroupListType) {
  return request(`/api/basic/user/aut/setUserGroupRight`, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 获取当前用户的用户组编码
 */
export async function getUserGroupByDepCode(params: any) {
  return request('/api/basic/user/aut/getUserGroupByDepCode', {
    method: 'GET',
    params,
  });
}