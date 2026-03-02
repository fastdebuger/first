import request from '@/utils/request';

export interface LoginParamsType {
  userCode: string;
  pwd: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  const initPwd = { ts: parseInt(`${new Date().getTime() / 1000}`, 10), pwd: params.pwd };
  Object.assign(params, { user_code: params.userCode, initPwd });
  return request('/api/basic/naut/login', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

/**
 * 修改默认密码
 * @param params
 */
export async function modifyPwd(params: any) {
  return request('/api/basic/naut/modifyPwd', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 获取用户在所属WBS中的权限
 * @param params
 */
export async function getUserWbsRight(params: any) {
  return request('/api/basic/user/aut/getUserWbsRight', {
    method: 'GET',
    params,
  });
}

/**
 * 获取登录界面时登录的验证token和修改密码的验证token
 */
export async function getVerifyCode({ module }: any) {
  return request(`/api/basic/naut/verifyCode/${module}`);
}
