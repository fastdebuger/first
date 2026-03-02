import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryWbsDefineCompare,
  addWbsDefineCompare,
  delWbsDefineCompare,
  updateWbsDefineCompare,
  importWbsDefineCompare,
} from "@/services/finance/wbsDefineCompare";

/**
 * 定义state类型
 */
export interface IWbsDefineCompareStateType {}

/**
 * 定义Model数据类型
 */
export interface IWbsDefineCompareModelType {
  namespace: string;
  state: IWbsDefineCompareStateType;
  effects: {
    queryWbsDefineCompare: Effect;
    addWbsDefineCompare: Effect;
    delWbsDefineCompare: Effect;
    updateWbsDefineCompare: Effect;
    importWbsDefineCompare: Effect;
  };

  reducers: {};
}

/**
 * 对照表
 */
const WbsDefineCompareModel: IWbsDefineCompareModelType = {
  namespace: "wbsDefineCompare",

  state: {},

  effects: {
    *queryWbsDefineCompare({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryWbsDefineCompare, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWbsDefineCompare({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWbsDefineCompare, payload);
      if (callback) {
        callback(response);
      }
    },
    *delWbsDefineCompare({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delWbsDefineCompare, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWbsDefineCompare({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWbsDefineCompare, payload);
      if (callback) {
        callback(response);
      }
    },
    *importWbsDefineCompare({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importWbsDefineCompare, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default WbsDefineCompareModel;
