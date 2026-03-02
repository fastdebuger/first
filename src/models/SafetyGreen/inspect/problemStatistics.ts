import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";

import {
  getProblemGradingStatistics,
  getSubProblemGradingStatistics,
  getIfCloseStatistics,
  getBranchAndProjectStatistics,
  getProblemGradingLevelStatistics,
  getQualitySafetyInspectionObsName,
  getQualitySafetyInspectionObsNameStatistics,
  getQualitySafetyInspectionSystemBelongNameStatistics,
  getProblemClassificationStatistics,
  getQualitySafetyInspectionProblemCategoryStatistics,
  getQualitySafetyInspectionProblemTrend,
} from "@/services/safetyGreen/inspect/problemStatistics";

/**
 * 定义state类型
 */
export interface IProblemStatisticsStateType { }

/**
 * 定义Model数据类型
 */
export interface IProblemStatisticsModelType {
  namespace: string;
  state: IProblemStatisticsStateType;
  effects: {
    getProblemGradingStatistics: Effect;
    getSubProblemGradingStatistics: Effect;
    getIfCloseStatistics: Effect;
    getBranchAndProjectStatistics: Effect;
    getProblemGradingLevelStatistics: Effect;
    getQualitySafetyInspectionObsName: Effect;
    getQualitySafetyInspectionObsNameStatistics: Effect;
    getQualitySafetyInspectionSystemBelongNameStatistics: Effect;
    getProblemClassificationStatistics: Effect;
    getQualitySafetyInspectionProblemCategoryStatistics: Effect;
    getQualitySafetyInspectionProblemTrend: Effect;
  };

  reducers: {};
}

/**
 * 问题统计Model
 */
const ProblemStatisticsModel: IProblemStatisticsModelType = {
  namespace: "problemStatistics",

  state: {},

  effects: {
    *getProblemGradingStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProblemGradingStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getSubProblemGradingStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSubProblemGradingStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getIfCloseStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getIfCloseStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getBranchAndProjectStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBranchAndProjectStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getProblemGradingLevelStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProblemGradingLevelStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getQualitySafetyInspectionObsName({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySafetyInspectionObsName, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getQualitySafetyInspectionObsNameStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySafetyInspectionObsNameStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getQualitySafetyInspectionSystemBelongNameStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySafetyInspectionSystemBelongNameStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getProblemClassificationStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProblemClassificationStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getQualitySafetyInspectionProblemCategoryStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySafetyInspectionProblemCategoryStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getQualitySafetyInspectionProblemTrend({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySafetyInspectionProblemTrend, payload);
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

export default ProblemStatisticsModel;
