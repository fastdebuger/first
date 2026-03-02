import request from '@/utils/request';
interface GetTypeParams {
  filter?: string,
  sort: string,
  order: 'asc' | 'desc'
}

/**
 * 查询主合同签证台账列表表头
 * @param params
 */
export async function queryEngineeringVisaH(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/engineeringVisa/queryEngineeringVisaH', {
    method: 'GET',
    params,
  });
}

/**
 * 查询主合同签证台账 原来是多表改成单表模式
 * @param params
 */
export async function queryEngineeringVisa(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/engineeringVisa/queryEngineeringVisa', {
    method: 'GET',
    params,
  });
}

/**
 * 查询主合同签证台账列表表体
 * @param params
 */
export async function queryEngineeringVisaB(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/engineeringVisa/queryEngineeringVisaB', {
    method: 'GET',
    params,
  });
}


/**
 * 查询主合同签证台账列表平铺
 * @param params
 */
export async function queryEngineeringVisaFlat(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/engineeringVisa/queryEngineeringVisaFlat', {
    method: 'GET',
    params,
  });
}

/**
 * 修改主合同签证
 * @param params
 */
export async function updateEngineeringVisa(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/engineeringVisa/updateEngineeringVisa', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除主合同签证
 * @param params
 */
export async function delEngineeringVisa(params: any) {
  return request('/api/ZyyjIms/settlement/engineeringVisa/delEngineeringVisa', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 添加主合同签证
 * @param params
 */
export async function addEngineeringVisa(params: any) {
  return request('/api/ZyyjIms/settlement/engineeringVisa/addEngineeringVisa', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}