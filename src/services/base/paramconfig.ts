import request from '@/utils/request';

/**
 * 查询单据号规则配置
 * @param params
 */
export async function getMaterialFormNoConfig(params: any) {
  return request('/api/ZyyjIms/basic/basic/getMaterialFormNoConfig', {
    method: 'GET',
    params,
  });
}
/**
 * 查询系统参数自定义配置
 * @param params
 */
export async function getMaterialSysParam(params: any) {
  return request('/api/ZyyjIms/basic/basic/getMaterialSysParam', {
    method: 'GET',
    params,
  });
}
/**
 * 修改单据号规则配置
 * @param params
 */
export async function updateFormNoConfig(params: any) {
  return request('/api/ZyyjIms/basic/basic/updateFormNoConfig', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 修改系统参数自定义配置
 * @param params
 */
export async function updateMaterialSysParam(params: any) {
  return request('/api/ZyyjIms/basic/basic/updateMaterialSysParam', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
