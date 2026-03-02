import request from '@/utils/request';

export interface BaseObsListTypeNew {
  depCode?: string;
  level_no?: string;
  obs_code?: string;
  currDevCode?: string;
  sort: string;
  order: string
}

/**
 * 获取OBS信息
 * @param params
 */
export async function queryObs(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/queryObs', {
    method: 'GET',
    params,
  });
}


/**
 * 获取OBS信息
 * @param params
 */
export async function getRebuildObsCode(params: BaseObsListTypeNew) {
  return request('/api/ZyyjIms/basic/basic/getRebuildObsCode', {
    method: 'GET',
    params,
  });
}

/**
 * 修改OBS信息
 * @param params
 */
export async function updateObs(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/updateObs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 *  新增OBS信息
 * @param params
 */
export async function addObs(params: BaseObsListTypeNew) {
  // eslint-disable-next-line no-param-reassign
  params.currDevCode = '';
  return request('/api/basic/user/aut/addObs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除OBS信息
 * @param params
 */
export async function deleteObs(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/deleteObs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————分公司层级————附加信息
 * /basic/user/aut/queryObsBranchAdditional
 */
export async function queryObsBranchAdditional(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/queryObsBranchAdditional', {
    method: 'GET',
    params,
  });
}

/**
 *  设置————OBS分公司层级————附加信息
 * @param params
 */
export async function setObsBranchAdditionalFunc(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/setObsBranchAdditional', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————OBS项目部层级————附加信息
 * /basic/user/aut/queryObsDepAdditional
 */
export async function queryObsDepAdditional(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/queryObsDepAdditional', {
    method: 'GET',
    params,
  });
}

/**
 *  设置————OBS项目部层级————附加信息
 * @param params
 */
export async function setObsDepAdditional(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/setObsDepAdditional', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————OBS装置层级————附加信息
 * /basic/user/aut/queryObsDevAdditional
 */
export async function queryObsDevAdditional(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/queryObsDevAdditional', {
    method: 'GET',
    params,
  });
}

/**
 * 设置————OBS装置层级————附加信息
 * /basic/user/aut/setObsDevAdditional
 */
export async function setObsDevAdditional(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/setObsDevAdditional', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————CBS装置
 * /basic/user/aut/queryCbs
 */
export async function queryCbs(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/queryCbs', {
    method: 'GET',
    params,
  });
}

/**
 * 查询————设计院
 * /basic/user/aut/queryDesigner
 */
export async function queryDesigner(params: BaseObsListTypeNew) {
  return request('/api/basic/user/aut/queryDesigner', {
    method: 'GET',
    params,
  });
}
