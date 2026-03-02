import type { Reducer, Effect } from 'umi';
import { fakeAccountLogin, modifyPwd, getVerifyCode } from '@/services/login';
import { setLoginUserData } from '@/utils/authority';
import { getCode, getPageQuery } from '@/utils/utils';
import { ErrorCode, WORK_BENCH } from '@/common/const';
import { getUserGroupByDepCode, queryUserGroupRight } from '@/services/base/usergroup/list';
import type { ResponseGenerator } from '@/typings';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  errCode?: any;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
    modifyPwd: Effect;
    getVerifyCode: Effect;
    queryUserHaveModuleRight: Effect;
    modifyAuthority: Effect;
    getRebuildObsCode: Effect;
    getUserGroupByDepCode: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    saveUserWbsRight: Reducer<StateType>;
  };
}

/**
 * 对象数组分组
 * @param arr
 */
const groupObjArr = (arr: any[]) => {
  if (arr.length < 1) {
    return [];
  }
  return arr.reduce((prevValue: any, currentValue: any) => {
    let index = -1;
    prevValue.some((item: any, i: number) => {
      if (item.func_code === currentValue.func_code) {
        index = i;
        return true;
      }
      return false;
    });
    if (index > -1) {
      prevValue[index].ability_code.push({
        key: currentValue.ability_code,
        template_code: currentValue.template_code,
      });
    } else {
      prevValue.push({
        func_code: currentValue.func_code,
        ability_code: [
          {
            key: currentValue.ability_code,
            template_code: currentValue.template_code,
          },
        ],
      });
    }
    return prevValue;
  }, []);
};

const Model: LoginModelType = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  // @ts-ignore
  effects: {
    // eslint-disable-next-line complexity
    *login({ payload, callback }, { call, put }) {
      // @ts-ignore
      const response = yield call(fakeAccountLogin, payload);
      if (callback) callback(response);
      // Login successfully
      if (response.errCode === ErrorCode.ErrOk) {
        Object.assign(payload, { wbs_code: localStorage.getItem('auth-default-wbsCode') });
        const wbsLevel = response.userInfo && response.userInfo.default_prop_key;
        if (wbsLevel) {
          /** 第一步 登录成功 改变登录状态 */
          yield put({
            type: 'changeLoginStatus',
            payload: response,
          });
          yield put({
            type: 'modifyAuthority'
          });
          // 获取所有层级的权限
          yield put({
            type: 'getUserGroupByDepCode',
            callback: (res:any) => {
              if (res && res.rows) {
                const arr = res.rows.map((item: any) => {
                  return {
                    group_code: item.group_code || '',
                    group_name: item.group_name || '',
                  };
                });
                response.userInfo.groupInfo = arr;
                localStorage.setItem('login-user-information', JSON.stringify(response.userInfo));
              }
            }
          });
        } else {
          // 退出登陆时，清空缓存中的所有数据(除了版本)
          for (const itemKey in localStorage) {
            if (
              itemKey &&
              itemKey !== 'system-current-version-time' &&
              itemKey !== 'system-current-version' &&
              itemKey !== 'module-collect'
            ) {
              localStorage.removeItem(itemKey);
            }
          }
          alert('当前用户层级为空，请联系管理员设置用户层级后重新登录');
          throw new Error('用户所属层级的default_prop_key为空');
        }
      } else {
        // 解密或者一些特殊bug 自动清一下缓存
        localStorage.clear();
      }
    },
    *modifyAuthority({ payload }, { call }) {

      // 请求用户权限
      let groupList = [];
      let user = undefined
      try {
        groupList = JSON.parse(localStorage.getItem('login-user-information') as string).groupInfo;
        user = JSON.parse(localStorage.getItem('login-user-information') as string);
      } catch (e) {
        groupList = [];
      }

      const groupCode = groupList?.map((item: any) => item.group_code)?.join(',');
      const userGroupRight: any[] = yield call(queryUserGroupRight, {
        sort: 'func_code',
        order: 'asc',
        group_code: groupCode,
        is_app: '0,2',
        module_code: (() => {
          return getCode(payload?.propKey || localStorage?.getItem("auth-default-wbs-prop-key"))
        })()
      });

      localStorage.setItem('auth_wbs_right', JSON.stringify(groupObjArr(userGroupRight)));

      if (payload?.replaceUrl) {
        // 点击层级进入
        window.location.replace(payload?.replaceUrl);
      } else {
        // 初始化进入
        if (user?.default_prop_key === 'branchComp') {
          // 公司级
          window.location.replace(`/workBench?version=${WORK_BENCH.VERSION}`);
        } else {
          // 分公司和项目部
          window.location.replace(`/workBench?version=${WORK_BENCH.VERSION}`);
        }

      }

    },
    *modifyPwd({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(modifyPwd, payload);
      if (callback) callback(response);
    },
    // 获取验证token
    *getVerifyCode({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(getVerifyCode, payload);
      if (callback) callback(response);
    },

    logout() {
      const { redirect } = getPageQuery();
      // 退出登陆时，清空缓存中的所有数据(除了版本)
      for (const itemKey in localStorage) {
        if (
          itemKey &&
          itemKey !== 'system-current-version-time' &&
          itemKey !== 'system-current-version' &&
          itemKey !== 'module-collect'
        ) {
          localStorage.removeItem(itemKey);
        }
      }
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        window.location.replace(window.location.origin + '/user/login');
      }
    },

    *getUserGroupByDepCode({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(getUserGroupByDepCode, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setLoginUserData(payload?.userInfo);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveUserWbsRight(state, { payload }) {
      localStorage.setItem('auth_wbs_right', JSON.stringify(payload));
      return {
        ...state,
      };
    },
  },
};

export default Model;
