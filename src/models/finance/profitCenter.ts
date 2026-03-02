import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryProfitCenter,
  addProfitCenter,
  delProfitCenter,
  updateProfitCenter,
  importProfitCenter,
} from "@/services/finance/profitCenter";

/**
 * 定义state类型
 */
export interface IProfitCenterStateType {}

/**
 * 定义Model数据类型
 */
export interface IProfitCenterModelType {
  namespace: string;
  state: IProfitCenterStateType;
  effects: {
    queryProfitCenter: Effect;
    addProfitCenter: Effect;
    delProfitCenter: Effect;
    updateProfitCenter: Effect;
    importProfitCenter: Effect;
  };

  reducers: {};
}

/**
 * 利润中心
 */
const ProfitCenterModel: IProfitCenterModelType = {
  namespace: "profitCenter",

  state: {},

  effects: {
    *queryProfitCenter({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryProfitCenter, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addProfitCenter({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addProfitCenter, payload);
      if (callback) {
        callback(response);
      }
    },
    *delProfitCenter({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delProfitCenter, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateProfitCenter({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateProfitCenter, payload);
      if (callback) {
        callback(response);
      }
    },
    *importProfitCenter({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importProfitCenter, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default ProfitCenterModel;
