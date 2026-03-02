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
export async function querySubEngineeringVisaH(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subEngineeringVisa/querySubEngineeringVisaH', {
    method: 'GET',
    params,
  });
}

/**
 * 查询主合同签证台账列表表头
 * @param params
 */
export async function querySubEngineeringVisa(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subEngineeringVisa/querySubEngineeringVisa', {
    method: 'GET',
    params,
  });
}

/**
 * 查询主合同签证台账列表表体
 * @param params
 */
export async function querySubEngineeringVisaB(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subEngineeringVisa/querySubEngineeringVisaB', {
    method: 'GET',
    params,
  });
}


/**
 * 查询主合同签证台账列表平铺
 * @param params
 */
export async function querySubEngineeringVisaFlat(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subEngineeringVisa/querySubEngineeringVisaFlat', {
    method: 'GET',
    params,
  });
}

/**
 * 修改主合同签证
 * @param params
 */
export async function updateSubEngineeringVisa(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subEngineeringVisa/updateSubEngineeringVisa', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除主合同签证
 * @param params
 */
export async function delSubEngineeringVisa(params: any) {
  return request('/api/ZyyjIms/settlement/subEngineeringVisa/delSubEngineeringVisa', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 添加主合同签证
 * @param params
 */
export async function addSubEngineeringVisa(params: any) {
  return request('/api/ZyyjIms/settlement/subEngineeringVisa/addSubEngineeringVisa', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}