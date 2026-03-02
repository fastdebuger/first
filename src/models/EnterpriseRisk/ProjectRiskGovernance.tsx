import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";

import {
  saveBatch,
  saveBatchRiskAnalysis,
  saveBatchRiskAnswer,
  saveBatchRiskExamine,
  updateInfo,
  delInfo,
  getInfo,
  queryMainInfo,
  queryRiskMonitoringProjectName,
  queryRiskAnalysisInfo,
  queryRiskAnalysisResultInfo
} from "@/services/enterpriseRisk/projectRiskGovernance";
import { ErrorCode } from "@yayang/constants";

/**
 * 定义state类型
 */
export interface ICollectionOfRiskIncidentsType { }

/**
 * 定义Model数据类型
 */
export interface ICollectionOfRiskIncidentsModelType {
  namespace: string;
  state: ICollectionOfRiskIncidentsType;
  effects: {
    saveBatch: Effect;
    saveBatchRiskAnalysis: Effect;
    saveBatchRiskAnswer: Effect;
    saveBatchRiskExamine: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    getInfo: Effect;
    queryMainInfo: Effect;
    queryRiskMonitoringProjectName: Effect;
    queryRiskAnalysisInfo: Effect;
    queryRiskAnalysisResultInfo: Effect;
  };

  reducers: {};
}

/**
 * 风险事件收集
 */
const CollectionOfRiskIncidentsModel: ICollectionOfRiskIncidentsModelType = {
  namespace: "projectRiskGovernance",

  state: {
    riskMonitoringProject:[]
  },

  effects: {
    *saveBatch({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatch, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveBatchRiskAnalysis({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatchRiskAnalysis, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveBatchRiskAnswer({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatchRiskAnswer, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveBatchRiskExamine({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatchRiskExamine, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryMainInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryMainInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskMonitoringProjectName({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskMonitoringProjectName, payload);
      if (callback) {
        callback(response);
      }
      if (response.errCode === ErrorCode.ErrOk) {
        yield put({
          type: 'saveRiskMonitoringProject',
          payload: response,
        });
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskAnalysisInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskAnalysisInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskAnalysisResultInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskAnalysisResultInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
  },
  reducers: {
    saveRiskMonitoringProject(state, action) {
      return {
        ...state,
        riskMonitoringProject: action.payload || null,
      };
    },
  },
};

export default CollectionOfRiskIncidentsModel;
