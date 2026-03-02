import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  saveBatch,  
  updateInfo,  
  delInfo,  
  queryStat,
  importInfo
} from "@/services/quality/qualityInfo/contractor";

/**
 * 定义state类型
 */
export interface IScoringPersonnelStateType {}

/**
 * 定义Model数据类型
 */
export interface IScoringPersonnelModelType {
  namespace: string;
  state: IScoringPersonnelStateType;
  effects: {
    getInfo: Effect;
    saveBatch: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    queryStat: Effect;
    importInfo: Effect;
  };

  reducers: {};
}

/**
 * 记分人员信息
 */
const ScoringPersonnelModel: IScoringPersonnelModelType = {
  namespace: "contractor",

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
    *queryStat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryStat, payload);
      if (callback) {
        callback(response);
      }
    },
    *importInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default ScoringPersonnelModel;
