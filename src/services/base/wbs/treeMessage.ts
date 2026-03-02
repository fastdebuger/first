import request from '@/utils/request';

export interface BaseWbsListTypeNew {
  depCode: string;
  level_no: string;
  wbs_code: string;
  currDevCode: string;
}

/**
 * 获取WBS信息
 * @param params
 */
export async function queryWbs(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryWbs', {
    method: 'GET',
    params,
  });
}

/**
 * 修改WBS信息
 * @param params
 */
export async function updateWbs(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/updateWbs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 *  新增WBS信息
 * @param params
 */
export async function addWbs(params: BaseWbsListTypeNew) {
  // eslint-disable-next-line no-param-reassign
  params.currDevCode = '';
  return request('/api/basic/user/aut/addWbs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除WBS信息
 * @param params
 */
export async function deleteWbs(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/deleteWbs', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————分公司层级————附加信息
 * /basic/user/aut/queryWbsBranchAdditional
 */
export async function queryWbsBranchAdditional(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryWbsBranchAdditional', {
    method: 'GET',
    params,
  });
}

/**
 *  设置————WBS分公司层级————附加信息
 * @param params
 */
export async function setWbsBranchAdditionalFunc(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/setWbsBranchAdditional', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————WBS项目部层级————附加信息
 * /basic/user/aut/queryWbsDepAdditional
 */
export async function queryWbsDepAdditional(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryWbsDepAdditional', {
    method: 'GET',
    params,
  });
}

/**
 *  设置————WBS项目部层级————附加信息
 * @param params
 */
export async function setWbsDepAdditional(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/setWbsDepAdditional', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————WBS装置层级————附加信息
 * /basic/user/aut/queryWbsDevAdditional
 */
export async function queryWbsDevAdditional(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryWbsDevAdditional', {
    method: 'GET',
    params,
  });
}

/**
 * 设置————WBS装置层级————附加信息
 * /basic/user/aut/setWbsDevAdditional
 */
export async function setWbsDevAdditional(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/setWbsDevAdditional', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询————CBS装置
 * /basic/user/aut/queryCbs
 */
export async function queryCbs(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryCbs', {
    method: 'GET',
    params,
  });
}

/**
 * 查询————设计院
 * /basic/user/aut/queryDesigner
 */
export async function queryDesigner(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryDesigner', {
    method: 'GET',
    params,
  });
}
/**
 * 查询装置分类
 * /basic/user/aut/queryDeliveryType
 */
export async function queryDeliveryType(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryDeliveryType', {
    method: 'GET',
    params,
  });
}
