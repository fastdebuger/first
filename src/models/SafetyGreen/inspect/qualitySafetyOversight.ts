import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualitySafetyInspection,
  addQualitySafetyInspection,
  updateQualitySafetyInspection,
  deleteQualitySafetyInspection,
  importQualitySafetyInspection,
  getTemplateZyyjIms,
  updateIfClose,
  updateBatchIsClose,
  getDateProblemTypeStatistics,
  getBranchWeightNumRadioScore,
  updateBatchHourNum
} from "@/services/safetyGreen/inspect/qualitySafetyOversight";

/**
 * 定义state类型
 */
export interface IQualitySafetyInspectionStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualitySafetyInspectionModelType {
  namespace: string;
  state: IQualitySafetyInspectionStateType;
  effects: {
    getQualitySafetyInspection: Effect;
    addQualitySafetyInspection: Effect;
    updateQualitySafetyInspection: Effect;
    deleteQualitySafetyInspection: Effect;
    importQualitySafetyInspection: Effect;
    getTemplateZyyjIms: Effect;
    updateIfClose: Effect;
    updateBatchIsClose: Effect;
    getDateProblemTypeStatistics: Effect;
    getBranchWeightNumRadioScore: Effect;
    updateBatchHourNum: Effect;
  };

  reducers: {};
}

/**
 * 质量安全监督检查问题清单
 */
const QualitySafetyInspectionModel: IQualitySafetyInspectionModelType = {
  namespace: "qualitySafetyInspection",

  state: {},

  effects: {
    *getQualitySafetyInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySafetyInspection, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualitySafetyInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualitySafetyInspection, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateQualitySafetyInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualitySafetyInspection, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteQualitySafetyInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualitySafetyInspection, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *importQualitySafetyInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importQualitySafetyInspection, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getTemplateZyyjIms({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getTemplateZyyjIms, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateIfClose({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateIfClose, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateBatchIsClose({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateBatchIsClose, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getDateProblemTypeStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getDateProblemTypeStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getBranchWeightNumRadioScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBranchWeightNumRadioScore, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateBatchHourNum({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateBatchHourNum, payload);
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

export default QualitySafetyInspectionModel;
