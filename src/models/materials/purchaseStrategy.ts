import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  addMaterialsPurchaseStrategy,
  deleteMaterialsPurchaseStrategy,
  queryServicePurchaseStrategyBody,
  queryServicePurchaseStrategyFlat,
  getMaterialsPurchaseStrategy,
  updateMaterialsPurchaseStrategy,
} from "@/services/materials/purchaseStrategy";

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
    addMaterialsPurchaseStrategy: Effect;
    deleteMaterialsPurchaseStrategy: Effect;
    queryServicePurchaseStrategyBody: Effect;
    queryServicePurchaseStrategyFlat: Effect;
    getMaterialsPurchaseStrategy: Effect;
    updateMaterialsPurchaseStrategy: Effect;
  };

  reducers: {};
}

/**
 * 采购组
 */
const PurchaseModel: IPurchaseModelType = {
  namespace: "purchaseStrategy",

  state: {},

  effects: {
    *addMaterialsPurchaseStrategy({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMaterialsPurchaseStrategy, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteMaterialsPurchaseStrategy({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteMaterialsPurchaseStrategy, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryServicePurchaseStrategyBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryServicePurchaseStrategyBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryServicePurchaseStrategyFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryServicePurchaseStrategyFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMaterialsPurchaseStrategy({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMaterialsPurchaseStrategy, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateMaterialsPurchaseStrategy({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMaterialsPurchaseStrategy, payload);
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

export default PurchaseModel;
