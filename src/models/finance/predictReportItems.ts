import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryPredictReportItems,
  queryDepPredictReportItems,
  queryCompanyPredictReportItems,
  querySubCompanyPredictReportItems,
  addPredictReportItems,
  delPredictReportItems,
  updatePredictReportItems,
  importPredictReportItems,
} from "@/services/finance/predictReportItems";

/**
 * 定义state类型
 */
export interface IPredictReportItemsStateType {}

/**
 * 定义Model数据类型
 */
export interface IPredictReportItemsModelType {
  namespace: string;
  state: IPredictReportItemsStateType;
  effects: {
    queryPredictReportItems: Effect;
    queryDepPredictReportItems: Effect;
    queryCompanyPredictReportItems: Effect;
    querySubCompanyPredictReportItems: Effect;
    addPredictReportItems: Effect;
    delPredictReportItems: Effect;
    updatePredictReportItems: Effect;
    importPredictReportItems: Effect;
  };

  reducers: {};
}

/**
 * 损益预测
 */
const PredictReportItemsModel: IPredictReportItemsModelType = {
  namespace: "predictReportItems",

  state: {},

  effects: {
    *queryDepPredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryDepPredictReportItems, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryCompanyPredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryCompanyPredictReportItems, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySubCompanyPredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySubCompanyPredictReportItems, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPredictReportItems, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPredictReportItems, payload);
      if (callback) {
        callback(response);
      }
    },
    *delPredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delPredictReportItems, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePredictReportItems, payload);
      if (callback) {
        callback(response);
      }
    },
    *importPredictReportItems({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importPredictReportItems, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default PredictReportItemsModel;
