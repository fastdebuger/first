import request from '@/utils/request';

/**
 * 查询零件台账信息
 * @param params
 */
export async function getPartsledger(params: any) {
  return request('/api/SteelStructure/parts/getPartsledger', {
    method: 'GET',
    params,
  });
}

/**
 * 添加零件台账信息
 * @param params
 */
export async function addPartsledger(params: any) {
  return request('/api/SteelStructure/parts/addPartsledger', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改零件台账信息
 * @param params
 */
export async function updatePartsledger(params: any) {
  return request('/api/SteelStructure/parts/updatePartsledger', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除零件台账信息
 * @param params
 */
export async function deletePartsledger(params: any) {
  return request('/api/SteelStructure/parts/deletePartsledger', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 导入零件台账信息
 * @param params
 */
export async function importSub(params: any) {
  return request('/api/SteelStructure/parts/importPart', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 导入零件台账信息
 * @param params
 */
export async function deleteAllledger(params: any) {
  return request('/api/SteelStructure/parts/deleteAllledger', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * json格式添加零件台账
 * @param params
 */
export async function importJSONFormatPartLedger(params: any) {
  return request('/api/SteelStructure/parts/importJSONFormatPartLedger', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 查询零件模型属性对照配置
 * @param params
 */
export async function getPartsFieldMap(params: any) {
  return request('/api/SteelStructure/parts/getPartsFieldMap', {
    method: 'GET',
    params,
  });
}

/**
 * 新增零件模型属性对照配置
 * @param params
 */
export async function addPartsFieldMap(params: any) {
  return request('/api/SteelStructure/parts/addPartsFieldMap', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改零件模型属性对照配置
 * @param params
 */
export async function updatePartsFieldMap(params: any) {
  return request('/api/SteelStructure/parts/updatePartsFieldMap', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除零件模型属性对照配置
 * @param params
 */
export async function deletePartsFieldMap(params: any) {
  return request('/api/SteelStructure/parts/deletePartsFieldMap', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 根据零件模型唯一标识，查询构件信息(唯一标识等)
 * @param params
 */
export async function queryMemberByPart(params: any) {
  return request('/api/SteelStructure/parts/queryMemberByPart', {
    method: 'GET',
    params,
  });
}
