import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryTaxBook,
  addTaxBook,
  delTaxBook,
  updateTaxBook,
  importTaxBook,
} from "@/services/finance/taxBook";

/**
 * 定义state类型
 */
export interface ITaxBookStateType {}

/**
 * 定义Model数据类型
 */
export interface ITaxBookModelType {
  namespace: string;
  state: ITaxBookStateType;
  effects: {
    queryTaxBook: Effect;
    addTaxBook: Effect;
    delTaxBook: Effect;
    updateTaxBook: Effect;
    importTaxBook: Effect;
  };

  reducers: {};
}

/**
 * 税金台账
 */
const TaxBookModel: ITaxBookModelType = {
  namespace: "taxBook",

  state: {},

  effects: {
    *queryTaxBook({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTaxBook, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addTaxBook({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addTaxBook, payload);
      if (callback) {
        callback(response);
      }
    },
    *delTaxBook({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delTaxBook, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateTaxBook({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateTaxBook, payload);
      if (callback) {
        callback(response);
      }
    },
    *importTaxBook({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importTaxBook, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default TaxBookModel;
