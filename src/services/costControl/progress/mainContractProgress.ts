import request from '@/utils/request';
interface GetTypeParams {
  filter?: string,
  sort: string,
  order: 'asc' | 'desc'
}
/**
 * 查询主合同进度款台账列表
 * @param params
 */
export async function queryProgressPaymentFlat(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/progressPayment/queryProgressPaymentFlat', {
    method: 'GET',
    params,
  });
}

/**
 * 查询主合同进度款记录
 * @param params
 */
export async function queryProgressPaymentBody(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/progressPayment/queryProgressPaymentBody', {
    method: 'GET',
    params,
  });
}



/**
 * 添加主合同进度款合同
 * @param params
 */
export async function addProgressPayment(params: any) {
  return request('/api/ZyyjIms/settlement/progressPayment/addProgressPayment', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 追加主合同进度款
 * @param params
 */
export async function addProgressPaymentNumber(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/progressPayment/addProgressPaymentNumber', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 编辑当前合同进度款
 * @param params
 */
export async function updateProgressPaymentBody(params: any) {
  return request('/api/ZyyjIms/settlement/progressPayment/updateProgressPaymentBody', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除主合同
 * @param params
 */
export async function delProgressPayment(params: any) {
  return request('/api/ZyyjIms/settlement/progressPayment/delProgressPayment', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 导出主合同进度款
 * @param params
 */
export async function exportProgressPaymentFlat(params: any) {
  return request('/api/ZyyjIms/settlement/progressPayment/exportProgressPaymentFlat', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


