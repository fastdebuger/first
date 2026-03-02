import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  addBalanceInventory,
  deleteBalanceInventory,
  queryBakData,
  updateBalanceInventory,
  addPoPlanB1,
  queryPoPlan1,
  addPoPlanB2,
  queryPoPlan2,
} from "@/services/materials/balancedLiquidity";

/**
 * 定义state类型
 */
export interface IPurchaseStateType { }

/**
 * 定义Model数据类型
 */
export interface IPurchaseModelType {
  namespace: string;
  state: IPurchaseStateType;
  effects: {
    addBalanceInventory: Effect;
    deleteBalanceInventory: Effect;
    queryBakData: Effect;
    updateBalanceInventory: Effect;
    addPoPlanB1: Effect;
    queryPoPlan1: Effect;
    addPoPlanB2: Effect;
    queryPoPlan2: Effect;
  };

  reducers: {};
}

/**
 * 供应商信息台账
 */
const PurchaseModel: IPurchaseModelType = {
  namespace: "balancedLiquidity",

  state: {},

  effects: {
    *addBalanceInventory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addBalanceInventory, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteBalanceInventory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteBalanceInventory, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryBakData({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryBakData, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateBalanceInventory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateBalanceInventory, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *addPoPlanB1({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPoPlanB1, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPoPlan1({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPoPlan1, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPoPlanB2({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPoPlanB2, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPoPlan2({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPoPlan2, payload);
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

export default PurchaseModel;
