import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getSupplierContract,
  addSupplierContract,
  updateSupplierContract,
  deleteSupplierContract,
  importIncomeInfo,
} from "@/services/engineering/supplierContract";

/**
 * 定义state类型
 */
export interface ISupplierContractStateType {}

/**
 * 定义Model数据类型
 */
export interface ISupplierContractModelType {
  namespace: string;
  state: ISupplierContractStateType;
  effects: {
    getSupplierContract: Effect;
    addSupplierContract: Effect;
    updateSupplierContract: Effect;
    deleteSupplierContract: Effect;
    importIncomeInfo: Effect;
  };

  reducers: {};
}

/**
 * 供应商合同
 */
const SupplierContractModel: ISupplierContractModelType = {
  namespace: "supplierContract",

  state: {},

  effects: {
    *getSupplierContract({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSupplierContract, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSupplierContract({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSupplierContract, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSupplierContract({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSupplierContract, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteSupplierContract({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSupplierContract, payload);
      if (callback) {
        callback(response);
      }
    },
    *importIncomeInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importIncomeInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default SupplierContractModel;
