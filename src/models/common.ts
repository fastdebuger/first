import type { Reducer, Effect } from 'umi';
import {
  downloadImportTemplate,
  fetchDevList,
  fetchUnitList,
  fetchUnitProjectList,
  queryTeamLst,
  querySubWbsUser,
  queryWbsByUserCanSwitch,
  queryUserAscriptionDev,
  queryUserInfo,
  querySublettingInfo,
  getWebParam,
  querySysBasicDict,
  addSysBasicDict,
  updateSysBasicDict,
  deleteSysBasicDict,
} from '@/services/common/list';
import { deepArr } from '@/utils/utils-array';
import { genTreeData } from '@/utils/utils';
import type { ResponseGenerator } from '@/typings';
import { queryObs, getRebuildObsCode } from '@/services/base/obs/list';
import { queryWBS } from '@/services/user';

/**
 * 定义state类型
 */
export interface CommonStateType {
  list?: any;
  devList?: any;
  unitProjectList?: any;
  unitList?: any;
  obsList?: any;
  subWbsUserList?: any;
  professionList?: any;
  professionTagList?: any;
  qualityTypeList?: any;
  authDevList?: any;
  wbsTreeList?: any;
  outUserList?: any;
  userInfoList?: any;
  WBSList?:any;
  allUserListList?:any;
  sysBasicDictList?: any;
  showModal?: boolean;
}

/**
 * 定义Modal数据类型
 */
export interface CommonModalType {
  namespace: string;
  state: CommonStateType;
  effects: {
    downloadImportFile: Effect;
    fetchDevList: Effect;
    fetchUnitProjectList: Effect;
    fetchUnitList: Effect;
    fetchObsList: Effect;
    querySubWbsUser: Effect;
    queryUserAscriptionDev: Effect;
    queryWbsByUserCanSwitch: Effect;
    queryUserInfo: Effect;
    queryObs: Effect;
    getRebuildObsCode: Effect;
    querySublettingInfo: Effect;
    getWebParam: Effect;
    queryWBS: Effect;
    querySysBasicDict: Effect;
    addSysBasicDict: Effect;
    updateSysBasicDict: Effect;
    deleteSysBasicDict: Effect;
    showMessageModal: Effect;
  };
  reducers: {
    saveDevList: Reducer<CommonStateType>;
    saveUnitProjectList: Reducer<CommonStateType>;
    saveUnitList: Reducer<CommonStateType>;
    saveObsList: Reducer<CommonStateType>;
    saveSubWbsUserList: Reducer<CommonStateType>;
    saveProfessionList: Reducer<CommonStateType>;
    saveAuthDevList: Reducer<CommonStateType>;
    saveWbsTreeList: Reducer<CommonStateType>;
    saveUserInfoList: Reducer<CommonStateType>;
    saveWBS: Reducer<CommonStateType>;
    saveAllUserList: Reducer<CommonStateType>;
    saveSysBasicDict: Reducer<CommonStateType>;
    saveShowMessageModal: Reducer<CommonStateType>;
  };
}

const CommonModel: CommonModalType = {
  namespace: 'common',

  state: {
    list: {
      rows: [],
    },
    devList: [],
    unitProjectList: [],
    unitList: [],
    obsList: [],
    subWbsUserList: [],
    professionList: [],
    authDevList: [],
    wbsTreeList: [],
    outUserList: [],
    userInfoList: [],
    WBSList:[],
    allUserListList:[],
    sysBasicDictList: [],
    showModal: false,
  },

  effects: {
    *showMessageModal({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveShowMessageModal',
        payload: payload.isShow,
      });
    },
    *querySysBasicDict({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySysBasicDict, payload);
      yield put({
        type: 'saveSysBasicDict',
        payload: response.rows,
      });
      if (callback) {
        callback(response);
      }
    },
    *addSysBasicDict({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSysBasicDict, payload);
      if (callback) callback(response);
    },
    *updateSysBasicDict({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSysBasicDict, payload);
      if (callback) callback(response);
    },
    *deleteSysBasicDict({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSysBasicDict, payload);
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
    // 查询权限装置
    *queryUserAscriptionDev({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryUserAscriptionDev, payload);
      if (callback) callback(response);
      yield put({
        type: 'saveAuthDevList',
        payload: response.result || [],
      });
    },
    *downloadImportFile({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(downloadImportTemplate, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *fetchDevList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(fetchDevList, payload);
      if (response.result && response.result.length > 0) {
        response.result.forEach((item: any) => {
          Object.assign(item, {
            dev_code: item.wbs_code,
            dev_name: item.wbs_name,
          });
        });
      }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'saveDevList',
        payload: response.result || [],
      });
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *fetchUnitProjectList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(fetchUnitProjectList, payload);
      if (response.result && response.result.length > 0) {
        response.result.forEach((item: any) => {
          Object.assign(item, {
            unit_project_code: item.wbs_code,
            unit_project_name: item.wbs_name,
          });
        });
      }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'saveUnitProjectList',
        payload: response.result || [],
      });
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *fetchUnitList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(fetchUnitList, payload);
      if (response.result && response.result.length > 0) {
        response.result.forEach((item: any) => {
          Object.assign(item, {
            unit_code: item.wbs_code,
            unit_name: item.wbs_name,
          });
        });
      }
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'saveUnitList',
        payload: response.result || [],
      });
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *fetchObsList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTeamLst, payload);
      if (callback) callback(response);
      yield put({
        type: 'saveObsList',
        payload: response.result || [],
      });
    },
    *querySubWbsUser({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySubWbsUser, payload);
      if (callback) callback(response);
      yield put({
        type: 'saveSubWbsUserList',
        payload: response.rows || [],
      });
    },
    *queryUserInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryUserInfo, payload);
      if (callback) callback(response);
      yield put({
        type: 'saveSubWbsUserList',
        payload: response.rows || [],
      });
      yield put({
        type: 'saveAllUserList',
        payload: response.rows || [],
      });
      return response;
    },
    *queryWBS({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryWBS, payload);
      if (callback) callback(response);
      yield put({
        type: 'saveWBS',
        payload: response.rows || [],
      });
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryObs({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryObs, payload);
      if (callback) callback(response);
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getRebuildObsCode({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getRebuildObsCode, payload);
      if (callback) callback(response);
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySublettingInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySublettingInfo, payload);
      if (callback) callback(response);
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    * getWebParam({ payload, callback }, { call }) {
      const response = yield call(getWebParam);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve: any) => {
        resolve(response);
      });
    },
  },

  reducers: {
    saveShowMessageModal(state, action) {
      return {
        ...state,
        showModal: action.payload || false,
      };
    },
    saveWbsTreeList(state, action) {
      return {
        ...state,
        wbsTreeList: action.payload || [],
      };
    },
    saveAuthDevList(state, { payload }) {
      return {
        ...state,
        authDevList: payload,
      };
    },
    saveDevList(state, { payload }) {
      return {
        ...state,
        devList: payload,
      };
    },
    saveUnitProjectList(state, { payload }) {
      return {
        ...state,
        unitProjectList: payload,
      };
    },
    saveUnitList(state, { payload }) {
      return {
        ...state,
        unitList: payload,
      };
    },
    saveObsList(state, { payload }) {
      return {
        ...state,
        obsList: payload,
      };
    },
    saveSubWbsUserList(state, { payload }) {
      return {
        ...state,
        subWbsUserList: payload,
      };
    },
    saveProfessionList(state, { payload }) {
      return {
        ...state,
        professionList: payload,
      };
    },
    saveUserInfoList(state, { payload }) {
      return {
        ...state,
        userInfoList: payload,
      };
    },
    saveWBS(state, { payload }) {
      return {
        ...state,
        WBSList: payload,
      };
    },
    saveAllUserList(state, { payload }) {
      return {
        ...state,
        allUserListList: payload,
      };
    },
    saveSysBasicDict(state, { payload }) {
      return {
        ...state,
        sysBasicDictList: payload,
      };
    },
  },
};

export default CommonModel;
