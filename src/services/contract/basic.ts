import request from '@/utils/request';
interface GetTypeParams {
  filter?: string,
  sort: string,
  order: 'asc' | 'desc'
}
/**
 * 查询分类配置
 * @param params
 */
export async function getSysDict(params: GetTypeParams) {
  return request('/api/ZyyjIms/basic/sysDict/getSysDict', {
    method: 'GET',
    params,
  });
}


/**
 * 获取业主名称
 * @param params
 */
export async function getOwnerName(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/getOwnerName', {
    method: 'GET',
    params,
  });
}



/**
 * 获取甲方单位名称
 * @param params
 */
export async function getOwnerUnitName(params: GetTypeParams) {
  return request('/api/ZyyjIms/contract/IncomeInfo/getOwnerUnitName', {
    method: 'GET',
    params,
  });
}


/**
 * 查询单据号配置
 * @param params
 */
export async function getZyyjImsFormNoConfig(params: GetTypeParams) {
  return request('/api/ZyyjIms/basic/basic/getZyyjImsFormNoConfig', {
    method: 'GET',
    params,
  });
}


/**
 * 修改单据号配置
 * @param params
 */
export async function updateZyyjImsFormNoConfig(params: GetTypeParams) {
  return request('/api/ZyyjIms/basic/basic/updateZyyjImsFormNoConfig', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
