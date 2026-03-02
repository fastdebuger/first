import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getSupplierDateConfig,
  addSupplierDateConfig,
  updateSupplierDateConfig,
  deleteSupplierDateConfig,
  importSupplierDateConfig,
} from "@/services/engineering/supplierDateConfig";

/**
 * 定义state类型
 */
export interface ISupplierDateConfigStateType {}

/**
 * 定义Model数据类型
 */
export interface ISupplierDateConfigModelType {
  namespace: string;
  state: ISupplierDateConfigStateType;
  effects: {
    getSupplierDateConfig: Effect;
    addSupplierDateConfig: Effect;
    updateSupplierDateConfig: Effect;
    deleteSupplierDateConfig: Effect;
    importSupplierDateConfig: Effect;
  };

  reducers: {};
}

/**
 * 供应商打分日期配置
 */
const SupplierDateConfigModel: ISupplierDateConfigModelType = {
  namespace: "supplierDateConfig",

  state: {},

  effects: {
    *getSupplierDateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSupplierDateConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSupplierDateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSupplierDateConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSupplierDateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSupplierDateConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteSupplierDateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSupplierDateConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *importSupplierDateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importSupplierDateConfig, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default SupplierDateConfigModel;
