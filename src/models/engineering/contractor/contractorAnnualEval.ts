import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getAppraiseInfo,
  addAppraiseByYear,
  updateAppraiseByYear,
  delAppraiseByYear,
  getAppraiseDetail,
  getBasicConfig,
  getPerformanceConfig,
  
  getDepYearInfoList,
  getScore,
  addOutContractScoreInfo,
  getScoreRecordInfo,
  updateOutContractScoreInfo,
  publishScoreDep,
  updateContractorInfo,
  getContractorBasicInfo,
  getBranchCompYearInfoList,
  getCompYearInfoList,
  getBranchCompScore,
  getDepScore,
  branchCompEvaluate,
  compEvaluate,
  publishScoreBranch
} from "@/services/engineering/contractor/contractorAnnualEval";

/**
 * 定义state类型
 */
export interface IAppraiseInfoStateType {}

/**
 * 定义Model数据类型
 */
export interface IAppraiseInfoModelType {
  namespace: string;
  state: IAppraiseInfoStateType;
  effects: {
    getAppraiseInfo: Effect;
    addAppraiseByYear: Effect;
    updateAppraiseByYear: Effect;
    delAppraiseByYear: Effect;
    getAppraiseDetail: Effect;
    getBasicConfig: Effect;
    getPerformanceConfig: Effect;

    getDepYearInfoList: Effect;
    getScore: Effect;
    addOutContractScoreInfo: Effect;
    getScoreRecordInfo: Effect;
    updateOutContractScoreInfo: Effect;
    publishScoreDep: Effect;
    updateContractorInfo: Effect;
    getContractorBasicInfo: Effect;
    getBranchCompYearInfoList: Effect;
    getCompYearInfoList: Effect;
    getBranchCompScore: Effect;
    getDepScore: Effect;
    branchCompEvaluate: Effect;
    compEvaluate: Effect;
    publishScoreBranch: Effect;
  };

  reducers: {};
}

/**
 * 承包商年度评价基本信息
 */
const AppraiseInfoModel: IAppraiseInfoModelType = {
  namespace: "appraiseInfo",

  state: {},

  effects: {
    *getAppraiseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getAppraiseInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getBasicConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBasicConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getPerformanceConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPerformanceConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addAppraiseByYear({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addAppraiseByYear, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateAppraiseByYear({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateAppraiseByYear, payload);
      if (callback) {
        callback(response);
      }
    },
    *delAppraiseByYear({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delAppraiseByYear, payload);
      if (callback) {
        callback(response);
      }
    },
    *getAppraiseDetail({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getAppraiseDetail, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getDepYearInfoList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getDepYearInfoList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getScore, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addOutContractScoreInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addOutContractScoreInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getScoreRecordInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getScoreRecordInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateOutContractScoreInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateOutContractScoreInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *publishScoreDep({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(publishScoreDep, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateContractorInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateContractorInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getContractorBasicInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getContractorBasicInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getBranchCompYearInfoList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBranchCompYearInfoList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getCompYearInfoList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCompYearInfoList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getBranchCompScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBranchCompScore, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getDepScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getDepScore, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *branchCompEvaluate({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(branchCompEvaluate, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *compEvaluate({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(compEvaluate, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *publishScoreBranch({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(publishScoreBranch, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    
  },
  reducers: {},
};

export default AppraiseInfoModel;
