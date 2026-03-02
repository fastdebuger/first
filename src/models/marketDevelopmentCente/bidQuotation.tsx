import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  saveBatch,  
  updateInfo,  
  delInfo,  
} from "@/services/marketDevelopmentCente/bidQuotation";

/**
 * 定义state类型
 */
export interface IBidQuotationStateType {}

/**
 * 定义Model数据类型
 */
export interface IBidQuotationModelType {
  namespace: string;
  state: IBidQuotationStateType;
  effects: {
    getInfo: Effect;
    saveBatch: Effect;
    updateInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 投标报价管理
 */
const BidQuotationModel: IBidQuotationModelType = {
  namespace: "bidQuotation",

  state: {},

  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveBatch({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatch, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default BidQuotationModel;
