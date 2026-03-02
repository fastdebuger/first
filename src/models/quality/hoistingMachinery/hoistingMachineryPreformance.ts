import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,
  saveBatch,
  updateInfo,
  delInfo,
  sendApproval
} from "@/services/quality/hoistingMachinery/hoistingMachineryPreformance";

/**
 * 定义state类型
 */
export interface IHoistingMachineryPreformanceStateType { }

/**
 * 定义Model数据类型
 */
export interface IHoistingMachineryPreformanceModelType {
  namespace: string;
  state: IHoistingMachineryPreformanceStateType;
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
 * 起重机械施工业绩表
 */
const HoistingMachineryPreformanceModel: IHoistingMachineryPreformanceModelType = {
  namespace: "hoistingMachineryPreformance",

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

export default HoistingMachineryPreformanceModel;
