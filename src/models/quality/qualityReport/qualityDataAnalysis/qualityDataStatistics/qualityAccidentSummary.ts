import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityAccidentSummary,
  addQualityAccidentSummary,
  updateQualityAccidentSummary,
  deleteQualityAccidentSummary,
} from "@/services/quality/qualityReport/qualityDataAnalysis/qualityDataStatistics/qualityAccidentSummary";

/**
 * 定义state类型
 */
export interface IQualityAccidentSummaryStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityAccidentSummaryModelType {
  namespace: string;
  state: IQualityAccidentSummaryStateType;
  effects: {
    getQualityAccidentSummary: Effect;
    addQualityAccidentSummary: Effect;
    updateQualityAccidentSummary: Effect;
    deleteQualityAccidentSummary: Effect;
  };

  reducers: {};
}

/**
 * 质量事故汇总表
 */
const QualityAccidentSummaryModel: IQualityAccidentSummaryModelType = {
  namespace: "qualityAccidentSummary",

  state: {},

  effects: {
    *getQualityAccidentSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityAccidentSummary, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityAccidentSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityAccidentSummary, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityAccidentSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityAccidentSummary, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityAccidentSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityAccidentSummary, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityAccidentSummaryModel;
