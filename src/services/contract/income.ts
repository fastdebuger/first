import request from '@/utils/request';
interface GetTypeParams {
  filter?: string,
  sort: string,
  order: 'asc' | 'desc'
}
/**
 * 查询收入合同信息表
 * @param params
 */
export async function getIncomeInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/getIncomeInfo', {
    method: 'GET',
    params,
  });
}

/**
 * 查询WBS项目定义合同数量
 * @param params
 */
export async function queryWbsDefineCodeContractCountList(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/queryWbsDefineCodeContractCountList', {
    method: 'GET',
    params,
  });
}


/**
 * 添加收入合同信息表
 * @param params
 */
export async function addIncomeInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/addIncomeInfo', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改收入合同信息表
 * @param params
 */
export async function updateIncomeInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/updateIncomeInfo', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除收入合同信息表
 * @param params
 */
export async function deleteIncomeInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/deleteIncomeInfo', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除收入合同共享合同信息表
 * @param params
 */
export async function deleteIncomeInfoB(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/deleteIncomeInfoB', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 查询合同金额等级
 * @param params
 */
export async function getPriceLevel(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/priceLevel/getPriceLevel', {
    method: 'GET',
    params,
  });
}

/**
 * 添加合同金额等级
 * @param params
 */
export async function deletePriceLevel(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/priceLevel/deletePriceLevel', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改合同金额等级
 * @param params
 */
export async function updatePriceLevel(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/priceLevel/updatePriceLevel', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 添加合同金额等级
 * @param params
 */
export async function addPriceLevel(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/priceLevel/addPriceLevel', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询主合同历史
 * @param params
 */
export async function getIncomeInfoLog(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/getIncomeInfoLog', {
    method: 'GET',
    params,
  });
}

/**
 * 查询进度款最大数量
 * @param params
 */
export async function queryProgressPaymentMaxNumber(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/progressPayment/queryProgressPaymentMaxNumber', {
    method: 'GET',
    params,
  });
}



/**
 * 查询进度款最大数量
 * @param params
 */
export async function queryProgressPaymentPriceRatio(params: GetTypeParams) {
  return request('/api/ZyyjIms/settlement/progressPayment/queryProgressPaymentPriceRatio', {
    method: 'GET',
    params,
  });
}


/**
 * 导入收入合同信息表
 * @param params
 */
export async function importIncomeInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/importIncomeInfo', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查看工程信息（物资）
 * @param params
 */
export async function queryIncomeInfoWeeklyStatus(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/queryIncomeInfoWeeklyStatus', {
    method: 'GET',
    params,
  });
}



/**
 * 批量添加支出信息
 * @param params
 */
export async function batchAddOutInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/out/batchAddOutInfo', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}



/**
 * 批量添加收入信息
 * @param params
 */
export async function batchAddIncomeInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/batchAddIncomeInfo', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 同步主合同
 * @param params
 */
export async function synContractIncomeInfo(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/synContractIncomeInfo', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
