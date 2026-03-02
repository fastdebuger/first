import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getSupplierScore,
  addSupplierScore,
  updateSupplierScore,
  deleteSupplierScore,
} from "@/services/engineering/supplierScore";

/**
 * 定义state类型
 */
export interface ISupplierScoreStateType {}

/**
 * 定义Model数据类型
 */
export interface ISupplierScoreModelType {
  namespace: string;
  state: ISupplierScoreStateType;
  effects: {
    getSupplierScore: Effect;
    addSupplierScore: Effect;
    updateSupplierScore: Effect;
    deleteSupplierScore: Effect;
  };

  reducers: {};
}

/**
 * 供应商得分
 */
const SupplierScoreModel: ISupplierScoreModelType = {
  namespace: "supplierScore",

  state: {},

  effects: {
    *getSupplierScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSupplierScore, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSupplierScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSupplierScore, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSupplierScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSupplierScore, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteSupplierScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSupplierScore, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default SupplierScoreModel;
