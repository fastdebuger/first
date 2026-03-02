import request from '@/utils/request';

export interface BaseWbsListTypeNew {
  depCode: string;
}

/**
 * 查询————设计院
 * /basic/user/aut/queryDesigner
 */
export async function queryDesigner(params: BaseWbsListTypeNew) {
  return request('/api/basic/user/aut/queryDesigner', {
    method: 'GET',
    params,
  });
}
