import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,
  saveInfo,
  updateInfo,
  delInfo,
  queryAssessmentConfig,
  queryEvaluationSummary,
  saveBatch,
  queryAssessmentDetail,
  updateBatch
} from "@/services/enterpriseRisk/annualAssessment";

/**
 * 定义state类型
 */
export interface IAnnualAssessmentStateType { }

/**
 * 定义Model数据类型
 */
export interface IAnnualAssessmentModelType {
  namespace: string;
  state: IAnnualAssessmentStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    queryAssessmentConfig: Effect;
    queryEvaluationSummary: Effect;
    saveBatch: Effect;
    queryAssessmentDetail: Effect;
    updateBatch: Effect;
  };

  reducers: {};
}

/**
 * 公司风险评估调查表
 */
const AnnualAssessmentModel: IAnnualAssessmentModelType = {
  namespace: "annualAssessment",

  state: {},

  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *saveBatch({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatch, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *queryAssessmentConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryAssessmentConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryEvaluationSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryEvaluationSummary, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryAssessmentDetail({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryAssessmentDetail, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateBatch({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateBatch, payload);
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

export default AnnualAssessmentModel;
