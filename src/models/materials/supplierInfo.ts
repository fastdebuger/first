import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  addSupplierLedger,
  deleteSupplierLedger,
  getSupplierLedger,
  updateSupplierLedger,
} from "@/services/materials/supplierInfo";

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
    addSupplierLedger: Effect;
    deleteSupplierLedger: Effect;
    getSupplierLedger: Effect;
    updateSupplierLedger: Effect;
  };

  reducers: {};
}

/**
 * 供应商信息台账
 */
const PurchaseModel: IPurchaseModelType = {
  namespace: "supplierInfo",

  state: {},

  effects: {
    *addSupplierLedger({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSupplierLedger, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteSupplierLedger({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSupplierLedger, payload);
      if (callback) {
        callback(response);
      }
    },
    *getSupplierLedger({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSupplierLedger, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateSupplierLedger({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSupplierLedger, payload);
      if (callback) {
        callback(response);
      }
    },

  },
  reducers: {},
};

export default PurchaseModel;
