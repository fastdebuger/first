import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityMonthlyReport,
  addQualityMonthlyReport,
  updateQualityMonthlyReport,
  deleteQualityMonthlyReport,
  startApproval,
} from "@/services/quality/qualityReport/qualityMonthlyReport";

/**
 * 定义state类型
 */
export interface IQualityMonthlyReportStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityMonthlyReportModelType {
  namespace: string;
  state: IQualityMonthlyReportStateType;
  effects: {
    getQualityMonthlyReport: Effect;
    addQualityMonthlyReport: Effect;
    updateQualityMonthlyReport: Effect;
    deleteQualityMonthlyReport: Effect;
    startApproval: Effect;
  };

  reducers: {};
}

/**
 * 质量月报
 */
const QualityMonthlyReportModel: IQualityMonthlyReportModelType = {
  namespace: "qualityMonthlyReport",

  state: {},

  effects: {
    *getQualityMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *startApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApproval, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityMonthlyReportModel;
