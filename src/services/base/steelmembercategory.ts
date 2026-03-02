import request from '@/utils/request';

/**
 * 查询钢构件类别
 * @param params
 */
export async function getMemberCategory(params: any) {
  return request('/api/SteelStructure/member/category/getMemberCategory', {
    method: 'GET',
    params,
  });
}

/**
 * 新增钢构件类别
 * @param params
 */
export async function addMemberCategory(params: any) {
  return request('/api/SteelStructure/member/category/addMemberCategory', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 修改钢构件类别
 * @param params
 */
export async function updateMemberCategory(params: any) {
  return request('/api/SteelStructure/member/category/updateMemberCategory', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除钢构件类别
 * @param params
 */
export async function deleteMemberCategory(params: any) {
  return request('/api/SteelStructure/member/category/deleteMemberCategory', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 删除钢构件类别
 * @param params
 */
export async function deleteAllMember(params: any) {
  return request('/api/SteelStructure/member/category/deleteAllMember', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
