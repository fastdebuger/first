import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getTechnologyQcNonconformitySummary,
  addTechnologyQcNonconformitySummary,
  updateTechnologyQcNonconformitySummary,
  deleteTechnologyQcNonconformitySummary,
  importTechnologyQcNonconformitySummary,
} from "@/services/technology/nonconformitySummary";

/**
 * 定义state类型
 */
export interface INonconformitySummaryStateType {}

/**
 * 定义Model数据类型
 */
export interface INonconformitySummaryModelType {
  namespace: string;
  state: INonconformitySummaryStateType;
  effects: {
    getTechnologyQcNonconformitySummary: Effect;
    addTechnologyQcNonconformitySummary: Effect;
    updateTechnologyQcNonconformitySummary: Effect;
    deleteTechnologyQcNonconformitySummary: Effect;
    importTechnologyQcNonconformitySummary: Effect;
  };

  reducers: {};
}

/**
 * 合格品汇总
 */
const NonconformitySummaryModel: INonconformitySummaryModelType = {
  namespace: "nonconformitySummary",

  state: {},

  effects: {
    *getTechnologyQcNonconformitySummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getTechnologyQcNonconformitySummary, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addTechnologyQcNonconformitySummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addTechnologyQcNonconformitySummary, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateTechnologyQcNonconformitySummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateTechnologyQcNonconformitySummary, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteTechnologyQcNonconformitySummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteTechnologyQcNonconformitySummary, payload);
      if (callback) {
        callback(response);
      }
    },
    *importTechnologyQcNonconformitySummary({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importTechnologyQcNonconformitySummary, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default NonconformitySummaryModel;
