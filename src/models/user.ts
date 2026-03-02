import type { Effect, Reducer } from 'umi';

import {
  queryCurrent,
  setUserDefaultDep,
  batchSetUserWbsAndDefaultDep,
  queryWbsByUserCanSwitch,
  geneWebDynamicMenu,
  querySysTaskInfo,
  queryColViewConfig,
  saveColViewConfig,
  queryWBS,
  queryUserInfoInclude,
  getObsCode,
  updateUserElecSignature,
  queryUserElecSignature
} from '@/services/user';
import { startApproval, settlementStartApproval,subEngineeringVisaStartApproval } from '@/services/backConfig/flow'
import { ErrorCode } from '@/common/const';
import { genTreeData } from '@/utils/utils';
import { deepArr } from '@/utils/utils-array';
import type { ResponseGenerator } from '@/typings';

export interface WbsNode {
  wbs_code: string;
  up_wbs_code: string;
  wbs_name?: string;
  [key: string]: any;
}

export interface CurrentUser {
  name?: string;
  unreadCount?: number;
  BasicInfo?: {
    UserCode: string;
    UserName: string;
    Pwd: string;
    ElecSignature: string;
    TelNum: string;
  };
  DefaultDep?: {
    DepCode: string;
    DepName: string;
    GroupCode: string;
    GroupName: string;
    UserCode: string;
  };
  AllDep?: {
    DepCode: string;
    DepName: string;
    [key: string]: any;
  }[];
}

export interface UserModelState {
  currentUser?: CurrentUser | null;
  wbsTreeList?: WbsNode[];
  webDynamicMenus?: any[];
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
    setUserDefaultDep: Effect;
    batchSetUserWbsAndDefaultDep: Effect;
    queryWbsByUserCanSwitch: Effect;
    geneWebDynamicMenu: Effect;
    queryWbsByUser: Effect;
    queryWBS: Effect;
    querySysTaskInfo: Effect;
    queryColViewConfig: Effect;
    saveColViewConfig: Effect;
    queryUserInfoInclude: Effect;
    startApproval: Effect;
    settlementStartApproval: Effect;
    subEngineeringVisaStartApproval: Effect;
    getObsCode: Effect;
    updateUserElecSignature: Effect;
    queryUserElecSignature: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveWebDynamicMenu: Reducer<UserModelState>;
    saveWbsTreeList: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: null,
    wbsTreeList: [],
    webDynamicMenus: [],
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response: ResponseGenerator = yield call(queryCurrent);
      if (response.errCode === ErrorCode.ErrOk) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
    *setUserDefaultDep({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(setUserDefaultDep, payload);
      if (callback) callback(response);
    },
    *batchSetUserWbsAndDefaultDep({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(batchSetUserWbsAndDefaultDep, payload);
      if (callback) callback(response);
    },
    *queryWbsByUserCanSwitch({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryWbsByUserCanSwitch, payload);
      if (response && response.rows) {
        const copyResArr = deepArr(response.rows);
        // 处理返回的WBS列表 处理成树状的结构
        const treeData = genTreeData(copyResArr, 'wbs_code', 'up_wbs_code');
        yield put({
          type: 'saveWbsTreeList',
          payload: treeData,
        });
      }
      if (callback) {
        callback(response);
      }
    },
    *geneWebDynamicMenu({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(geneWebDynamicMenu, payload);
      if (callback) {
        callback(response.result || []);
      }
      yield put({
        type: 'saveWebDynamicMenu',
        payload: response.result || [],
      });
    },
    // 获取用户权限wbs
    *queryWbsByUser({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryWBS, payload);
      const resArr = response.rows || [];
      const copyResArr = deepArr(resArr);
      // 处理返回的WBS列表 处理成树状的结构
      const treeData = genTreeData(copyResArr, 'wbs_code', 'up_wbs_code');
      if (callback) callback(treeData);
    },
    // 查询WBS信息
    *queryWBS({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryWBS, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySysTaskInfo({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(querySysTaskInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveColViewConfig({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(saveColViewConfig, payload);
      if (callback) callback(response);
    },
    *queryColViewConfig({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryColViewConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryUserInfoInclude({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryUserInfoInclude, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *startApproval({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(startApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *settlementStartApproval({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(settlementStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *subEngineeringVisaStartApproval({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(subEngineeringVisaStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getObsCode({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(getObsCode, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateUserElecSignature({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updateUserElecSignature, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryUserElecSignature({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryUserElecSignature, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || null,
      };
    },
    saveWbsTreeList(state, action) {
      return {
        ...state,
        wbsTreeList: action.payload || [],
      };
    },
    saveWebDynamicMenu(state, action) {
      return {
        ...state,
        webDynamicMenus: action.payload || [],
      };
    },
    changeNotifyCount(
      state = {
        currentUser: null,
        wbsTreeList: [],
        webDynamicMenus: [],
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...(state.currentUser || {}),
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
