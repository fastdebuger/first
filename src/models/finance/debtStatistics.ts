import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryDebtStatistics,
  addDebtStatistics,
  delDebtStatistics,
  updateDebtStatistics,
  importDebtStatistics,
  queryProfitCenter,
  getNetCreditFundForecast
} from "@/services/finance/debtStatistics";

/**
 * 定义state类型
 */
export interface IDebtStatisticsStateType { }

/**
 * 定义Model数据类型
 */
export interface IDebtStatisticsModelType {
  namespace: string;
  state: IDebtStatisticsStateType;
  effects: {
    queryDebtStatistics: Effect;
    addDebtStatistics: Effect;
    delDebtStatistics: Effect;
    updateDebtStatistics: Effect;
    importDebtStatistics: Effect;
    queryProfitCenter: Effect;
    getNetCreditFundForecast: Effect;
  };

  reducers: {};
}

/**
 * 债权统计表
 */
const DebtStatisticsModel: IDebtStatisticsModelType = {
  namespace: "debtStatistics",

  state: {},

  effects: {
    *queryDebtStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryDebtStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addDebtStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addDebtStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *delDebtStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delDebtStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateDebtStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateDebtStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *importDebtStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importDebtStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *queryProfitCenter({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryProfitCenter, payload);
      if (callback) {
        callback(response);
      }
    },
    *getNetCreditFundForecast({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getNetCreditFundForecast, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    }
  },
  reducers: {},
};

export default DebtStatisticsModel;
