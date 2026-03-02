import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  addPurchaseGroup,  
  deletePurchaseGroup,  
  getPurchaseGroup,  
  updatePurchaseGroup,  
} from "@/services/materials/purchase";

/**
 * 定义state类型
 */
export interface IPurchaseStateType {}

/**
 * 定义Model数据类型
 */
export interface IPurchaseModelType {
  namespace: string;
  state: IPurchaseStateType;
  effects: {
    addPurchaseGroup: Effect;
    deletePurchaseGroup: Effect;
    getPurchaseGroup: Effect;
    updatePurchaseGroup: Effect;
  };

  reducers: {};
}

/**
 * 采购组
 */
const PurchaseModel: IPurchaseModelType = {
  namespace: "purchase",

  state: {},

  effects: {
    *addPurchaseGroup({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPurchaseGroup, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePurchaseGroup({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deletePurchaseGroup, payload);
      if (callback) {
        callback(response);
      }
    },
    *getPurchaseGroup({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPurchaseGroup, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updatePurchaseGroup({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePurchaseGroup, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PurchaseModel;
