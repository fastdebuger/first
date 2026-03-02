import request from '@/utils/request';
import type { LoginParamsType } from '@/services/login';

export interface BaseWbsListType {
  depCode: string;
}

/**
 * 获取 所有的装置信息 需要缓存到本地
 * @param params
 */
export async function queryWbs(params: BaseWbsListType) {
  return request('/api/basic/aut/queryCompWbs', {
    method: 'GET',
    params,
  });
}

export async function queryDevType(params: BaseWbsListType) {
  return request('/api/basic/user/aut/queryDevType', {
    method: 'GET',
    params,
  });
}

/**
 * 通过LevelNo查询不同等级的WBS信息
 * @param params
 */
export async function queryLevelNoWbs(params: BaseWbsListType) {
  return request('/api/basic/aut/queryCompWbs', {
    method: 'GET',
    params,
  });
}

/**
 * 修改WBS信息
 * @param params
 */
export async function updateWbs(params: LoginParamsType) {
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
  const currDepCode = localStorage.getItem('auth-default-cpecc-currDepCode');
  Object.assign(params, { depCode, currDepCode });
  return request('/api/basic/aut/updateWbs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 *  新增WBS信息
 * @param params
 */
export async function addWbs(params: LoginParamsType) {
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
  const currDepCode = localStorage.getItem('auth-default-cpecc-currDepCode');
  Object.assign(params, { depCode, currDepCode });
  return request('/api/basic/aut/addWbs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除WBS信息
 * @param params
 */
export async function deleteWbs(params: LoginParamsType) {
  const depCode = localStorage.getItem('auth-default-cpecc-depCode');
  const currDepCode = localStorage.getItem('auth-default-cpecc-currDepCode');
  Object.assign(params, { depCode, currDepCode });
  return request('/api/basic/aut/deleteWbs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 查询装置列表
 * @param params
 */
export async function queryDevList(params: BaseWbsListType) {
  return request('/api/basic/user/aut/queryDevLst', {
    method: 'GET',
    params,
  });
}
