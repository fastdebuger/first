import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryPurchaseStrategyLotPlanHead,
  queryPurchaseStrategyLotPlanBody,
  queryPurchaseStrategyLotPlanFlat,
  addPurchaseStrategyLotPlan,
  updatePurchaseStrategyLotPlan,
  delPurchaseStrategyLotPlan,
} from "@/services/materials/purchaseStrategyLotPlan";

/**
 * 定义state类型
 */
export interface IPurchaseStrategyLotPlanStateType {}

/**
 * 定义Model数据类型
 */
export interface IPurchaseStrategyLotPlanModelType {
  namespace: string;
  state: IPurchaseStrategyLotPlanStateType;
  effects: {
    queryPurchaseStrategyLotPlanHead: Effect;
    queryPurchaseStrategyLotPlanBody: Effect;
    queryPurchaseStrategyLotPlanFlat: Effect;
    addPurchaseStrategyLotPlan: Effect;
    updatePurchaseStrategyLotPlan: Effect;
    delPurchaseStrategyLotPlan: Effect;
  };

  reducers: {};
}

/**
 * 工程物资单个标段策划方案
 */
const PurchaseStrategyLotPlanModel: IPurchaseStrategyLotPlanModelType = {
  namespace: "purchaseStrategyLotPlan",

  state: {},

  effects: {
    *queryPurchaseStrategyLotPlanHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPurchaseStrategyLotPlanHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPurchaseStrategyLotPlanBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPurchaseStrategyLotPlanBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPurchaseStrategyLotPlanFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPurchaseStrategyLotPlanFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPurchaseStrategyLotPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPurchaseStrategyLotPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePurchaseStrategyLotPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePurchaseStrategyLotPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *delPurchaseStrategyLotPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delPurchaseStrategyLotPlan, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PurchaseStrategyLotPlanModel;
