import request from '@/utils/request';
interface GetTypeParams {
  filter?: string,
  sort: string,
  order: 'asc' | 'desc'
}
/**
 * 查询分包商进度款台账列表
 * @param params
 */
export async function querySubProgressPaymentFlat(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subProgressPayment/querySubProgressPaymentFlat', {
    method: 'GET',
    params,
  });
}

/**
 * 查询分包商进度款记录
 * @param params
 */
export async function querySubProgressPaymentBody(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subProgressPayment/querySubProgressPaymentBody', {
    method: 'GET',
    params,
  });
}

/**
 * 添加分包商进度款合同
 * @param params
 */
export async function addSubProgressPayment(params: any) {
  return request('/api/ZyyjIms/settlement/subProgressPayment/addSubProgressPayment', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 追加分包商进度款
 * @param params
 */
export async function addSubProgressPaymentNumber(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/subProgressPayment/addSubProgressPaymentNumber', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 编辑当前分包商进度款
 * @param params
 */
export async function updateSubProgressPaymentBody(params: any) {
  return request('/api/ZyyjIms/settlement/subProgressPayment/updateSubProgressPaymentBody', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除分包商进度款
 * @param params
 */
export async function delSubProgressPayment(params: any) {
  return request('/api/ZyyjIms/settlement/subProgressPayment/delSubProgressPayment', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 导出分包商进度款
 * @param params
 */
export async function exportSubProgressPaymentFlat(params: any) {
  return request('/api/ZyyjIms/settlement/subProgressPayment/exportSubProgressPaymentFlat', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}




