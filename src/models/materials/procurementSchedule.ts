import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getPurchaseStrategySchedule,
  addPurchaseStrategySchedule,
  updatePurchaseStrategySchedule,
  deletePurchaseStrategySchedule,
  importPurchaseStrategySchedule,
} from "@/services/materials/procurementSchedule";

/**
 * 定义state类型
 */
export interface IPurchaseStrategyScheduleStateType {}

/**
 * 定义Model数据类型
 */
export interface IPurchaseStrategyScheduleModelType {
  namespace: string;
  state: IPurchaseStrategyScheduleStateType;
  effects: {
    getPurchaseStrategySchedule: Effect;
    addPurchaseStrategySchedule: Effect;
    updatePurchaseStrategySchedule: Effect;
    deletePurchaseStrategySchedule: Effect;
    importPurchaseStrategySchedule: Effect;
  };

  reducers: {};
}

/**
 * 采购进度计划
 */
const PurchaseStrategyScheduleModel: IPurchaseStrategyScheduleModelType = {
  namespace: "purchaseStrategySchedule",

  state: {},

  effects: {
    *getPurchaseStrategySchedule({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPurchaseStrategySchedule, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPurchaseStrategySchedule({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPurchaseStrategySchedule, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePurchaseStrategySchedule({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePurchaseStrategySchedule, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePurchaseStrategySchedule({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deletePurchaseStrategySchedule, payload);
      if (callback) {
        callback(response);
      }
    },
    *importPurchaseStrategySchedule({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importPurchaseStrategySchedule, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PurchaseStrategyScheduleModel;
