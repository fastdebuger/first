import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getMonthlyReport,
  addMonthlyReport,
  updateMonthlyReport,
  deleteMonthlyReport,
  importMonthlyReport,
  addConfirmationRecord,
  getCompConfirmationRecords,
  getMonthlyReportById,
  getNewMonthlyReport,
  getProjectBak,
  updateConfirmationRecord,
  getCurrMonthCompleteMonthlyReport,
  getCurrMonthNewMonthlyReport,
} from "@/services/engineering/monthlyReport";

/**
 * 定义state类型
 */
export interface IMonthlyReportStateType {}

/**
 * 定义Model数据类型
 */
export interface IMonthlyReportModelType {
  namespace: string;
  state: IMonthlyReportStateType;
  effects: {
    getMonthlyReport: Effect;
    addMonthlyReport: Effect;
    updateMonthlyReport: Effect;
    deleteMonthlyReport: Effect;
    importMonthlyReport: Effect;
    addConfirmationRecord: Effect;
    getCompConfirmationRecords: Effect;
    getMonthlyReportById: Effect;
    getNewMonthlyReport: Effect;
    getProjectBak: Effect;
    updateConfirmationRecord: Effect;
    getCurrMonthCompleteMonthlyReport: Effect;
    getCurrMonthNewMonthlyReport: Effect;
  };

  reducers: {};
}

/**
 * 项目月报
 */
const MonthlyReportModel: IMonthlyReportModelType = {
  namespace: "monthlyReport",

  state: {},

  effects: {
    *getMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *importMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *addConfirmationRecord({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addConfirmationRecord, payload);
      if (callback) {
        callback(response);
      }
    },
    *getCompConfirmationRecords({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCompConfirmationRecords, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMonthlyReportById({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMonthlyReportById, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getNewMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getNewMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getProjectBak({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProjectBak, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateConfirmationRecord({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateConfirmationRecord, payload);
      if (callback) {
        callback(response);
      }
    },
    *getCurrMonthCompleteMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCurrMonthCompleteMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getCurrMonthNewMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCurrMonthNewMonthlyReport, payload);
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

export default MonthlyReportModel;
