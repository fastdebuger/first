import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryQualityInspectionSummaryHead,
  queryQualityInspectionSummaryBody,
  queryQualityInspectionSummaryFlat,
  addQualityInspectionSummary,
  updateQualityInspectionSummary,
  delQualityInspectionSummary,
  getSysDict
} from "@/services/quality/qualityReport/qualityDataAnalysis/qualityDataStatistics/qualityInspectionSummary";

/**
 * 定义state类型
 */
export interface IQualityInspectionSummaryStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityInspectionSummaryModelType {
  namespace: string;
  state: IQualityInspectionSummaryStateType;
  effects: {
    queryQualityInspectionSummaryHead: Effect;
    queryQualityInspectionSummaryBody: Effect;
    queryQualityInspectionSummaryFlat: Effect;
    addQualityInspectionSummary: Effect;
    updateQualityInspectionSummary: Effect;
    delQualityInspectionSummary: Effect;
    getSysDict: Effect;
  };

  reducers: {};
}

/**
 * 质量大专项检查主要不合格项汇总情况分布
 */
const QualityInspectionSummaryModel: IQualityInspectionSummaryModelType = {
  namespace: "qualityInspectionSummary",

  state: {},

  effects: {
    *getSysDict({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSysDict, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualityInspectionSummaryHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualityInspectionSummaryHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualityInspectionSummaryBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualityInspectionSummaryBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualityInspectionSummaryFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualityInspectionSummaryFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityInspectionSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityInspectionSummary, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityInspectionSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityInspectionSummary, payload);
      if (callback) {
        callback(response);
      }
    },
    *delQualityInspectionSummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delQualityInspectionSummary, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityInspectionSummaryModel;
