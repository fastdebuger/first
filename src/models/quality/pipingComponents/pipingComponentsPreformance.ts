import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,
  saveBatch,
  updateInfo,
  delInfo,
  sendApproval
} from "@/services/quality/pipingComponents/pipingComponentsPreformance";

/**
 * 定义state类型
 */
export interface IPipingComponentsPreformanceStateType { }

/**
 * 定义Model数据类型
 */
export interface IPipingComponentsPreformanceModelType {
  namespace: string;
  state: IPipingComponentsPreformanceStateType;
  effects: {
    getInfo: Effect;
    saveBatch: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    sendApproval: Effect;
  };

  reducers: {};
}

/**
 * 压力管道元件施工业绩表
 */
const PipingComponentsPreformanceModel: IPipingComponentsPreformanceModelType = {
  namespace: "pipingComponentsPreformance",

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
    *sendApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendApproval, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PipingComponentsPreformanceModel;
