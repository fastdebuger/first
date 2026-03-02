import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getWeeklyReport,
  addWeeklyReport,
  updateWeeklyReport,
  deleteWeeklyReport,
  importWeeklyReport,
  addConfirmationRecord,
  getBranchConfirmationRecords,
  getNewWeeklyReport,
  getProjectBak,
  getWeeklyReportById,
  updateConfirmationRecord,
  getCurrWeekCompleteWeeklyReport,
  getCurrWeekNewWeeklyReport,
  getKeyProjectList,
  getKeyProjectStatistic
} from "@/services/engineering/weeklyReport";

/**
 * 定义state类型
 */
export interface IWeeklyReportStateType {}

/**
 * 定义Model数据类型
 */
export interface IWeeklyReportModelType {
  namespace: string;
  state: IWeeklyReportStateType;
  effects: {
    getWeeklyReport: Effect;
    addWeeklyReport: Effect;
    updateWeeklyReport: Effect;
    deleteWeeklyReport: Effect;
    importWeeklyReport: Effect;
    addConfirmationRecord: Effect;
    getBranchConfirmationRecords: Effect;
    getNewWeeklyReport: Effect;
    getProjectBak: Effect;
    getWeeklyReportById: Effect;
    updateConfirmationRecord: Effect;

    getCurrWeekCompleteWeeklyReport: Effect;
    getCurrWeekNewWeeklyReport: Effect;
    getKeyProjectList: Effect;
    getKeyProjectStatistic: Effect;
  };

  reducers: {};
}

/**
 * 项目周报
 */
const WeeklyReportModel: IWeeklyReportModelType = {
  namespace: "weeklyReport",

  state: {},

  effects: {
    *getWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWeeklyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWeeklyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWeeklyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteWeeklyReport, payload);
      if (callback) {
        callback(response);
      }
    },
    *importWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importWeeklyReport, payload);
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
    *getBranchConfirmationRecords({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBranchConfirmationRecords, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getNewWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getNewWeeklyReport, payload);
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
    *getWeeklyReportById({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWeeklyReportById, payload);
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
    *getCurrWeekCompleteWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCurrWeekCompleteWeeklyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getCurrWeekNewWeeklyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCurrWeekNewWeeklyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getKeyProjectList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getKeyProjectList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getKeyProjectStatistic({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getKeyProjectStatistic, payload);
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

export default WeeklyReportModel;
