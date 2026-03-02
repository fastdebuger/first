import request from '@/utils/request';
interface GetTypeParams {
  filter?: string,
  sort: string,
  order: 'asc' | 'desc'
}
/**
 * 查询支出合同信息表
 * @param params
 */
export async function queryContract(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/out/query', {
    method: 'GET',
    params,
  });
}

/**
 * 添加支出合同信息表
 * @param params
 */
export async function addContract(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/out/add', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改支出合同信息表
 * @param params
 */
export async function updateContract(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/out/update', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除支出合同信息表
 * @param params
 */
export async function deleteContract(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/out/del', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询承办部门和承办人
 * @param params
 */
export async function queryObsTemplate(params: GetTypeParams) {
  return request('/api/basic/sys/aut/queryObsTemplate', {
    method: 'GET',
    params,
  });
}


/**
 * 查询分包合同历史
 * @param params
 */
export async function queryLog(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/out/queryLog', {
    method: 'GET',
    params,
  });
}


/**
 * 导入支出合同信息表
 * @param params
 */
export async function importDataContract(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/out/importData', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
