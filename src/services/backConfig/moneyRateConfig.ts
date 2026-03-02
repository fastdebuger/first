import request from '@/utils/request';

/**
 * 查询币种汇率配置
 * @param params
 */
export async function getCurrencyExchangeRateConfig(params: any) {
  return request('/api/ZyyjIms/engineering/currencyExchangeRateConfig/getCurrencyExchangeRateConfig', {
    method: 'GET',
    params,
  });
}

/**
 * 添加币种汇率配置
 * @param params
 */
export async function addCurrencyExchangeRateConfig(params: any) {
  return request('/api/ZyyjIms/engineering/currencyExchangeRateConfig/addCurrencyExchangeRateConfig', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 删除币种汇率配置
 * @param params
 */
export async function deleteCurrencyExchangeRateConfig(params: any) {
  return request('/api/ZyyjIms/engineering/currencyExchangeRateConfig/deleteCurrencyExchangeRateConfig', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
/**
 * 修改币种汇率配置
 * @param params
 */
export async function updateCurrencyExchangeRateConfig(params: any) {
  return request('/api/ZyyjIms/engineering/currencyExchangeRateConfig/updateCurrencyExchangeRateConfig', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}