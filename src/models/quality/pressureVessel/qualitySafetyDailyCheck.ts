import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getHead,
  getBody,
  saveInfo,
  updateInfo,
  delInfo,
  sendApproval,
  queryUnQuality
} from "@/services/quality/pressureVessel/qualitySafetyDailyCheck";

/**
 * 定义state类型
 */
export interface IRiskControlConfigStateType { }

/**
 * 定义Model数据类型
 */
export interface IRiskControlConfigModelType {
  namespace: string;
  state: IRiskControlConfigStateType;
  effects: {
    getHead: Effect;
    getBody: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    sendApproval: Effect;
    queryUnQuality: Effect;
  };

  reducers: {};
}

/**
 * 特种设备每日质量安全检查记录信息
 */
const RiskControlConfigModel: IRiskControlConfigModelType = {
  namespace: "QualitySafetyDailyCheck",

  state: {},

  effects: {
    *getHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
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
    *queryUnQuality({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryUnQuality, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
  },
  reducers: {},
};

export default RiskControlConfigModel;
