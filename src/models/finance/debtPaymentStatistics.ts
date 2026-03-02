import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryDebtPaymentStatistics,
  addDebtPaymentStatistics,
  delDebtPaymentStatistics,
  updateDebtPaymentStatistics,
  importDebtPaymentStatistics,
} from "@/services/finance/debtPaymentStatistics";

/**
 * 定义state类型
 */
export interface IDebtPaymentStatisticsStateType { }

/**
 * 定义Model数据类型
 */
export interface IDebtPaymentStatisticsModelType {
  namespace: string;
  state: IDebtPaymentStatisticsStateType;
  effects: {
    queryDebtPaymentStatistics: Effect;
    addDebtPaymentStatistics: Effect;
    delDebtPaymentStatistics: Effect;
    updateDebtPaymentStatistics: Effect;
    importDebtPaymentStatistics: Effect;
  };

  reducers: {};
}

/**
 * 债务统计表
 */
const DebtPaymentStatisticsModel: IDebtPaymentStatisticsModelType = {
  namespace: "debtPaymentStatistics",

  state: {},

  effects: {
    *queryDebtPaymentStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryDebtPaymentStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addDebtPaymentStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addDebtPaymentStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *delDebtPaymentStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delDebtPaymentStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateDebtPaymentStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateDebtPaymentStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *importDebtPaymentStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importDebtPaymentStatistics, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default DebtPaymentStatisticsModel;
