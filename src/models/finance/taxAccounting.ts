import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryTaxAccounting,
  addTaxAccounting,
  delTaxAccounting,
  updateTaxAccounting,
  importTaxAccounting,
} from "@/services/finance/taxAccounting";

/**
 * 定义state类型
 */
export interface ITaxAccountingStateType {}

/**
 * 定义Model数据类型
 */
export interface ITaxAccountingModelType {
  namespace: string;
  state: ITaxAccountingStateType;
  effects: {
    queryTaxAccounting: Effect;
    addTaxAccounting: Effect;
    delTaxAccounting: Effect;
    updateTaxAccounting: Effect;
    importTaxAccounting: Effect;
  };

  reducers: {};
}

/**
 * 会计科目
 */
const TaxAccountingModel: ITaxAccountingModelType = {
  namespace: "taxAccounting",

  state: {},

  effects: {
    *queryTaxAccounting({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTaxAccounting, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addTaxAccounting({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addTaxAccounting, payload);
      if (callback) {
        callback(response);
      }
    },
    *delTaxAccounting({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delTaxAccounting, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateTaxAccounting({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateTaxAccounting, payload);
      if (callback) {
        callback(response);
      }
    },
    *importTaxAccounting({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importTaxAccounting, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default TaxAccountingModel;
