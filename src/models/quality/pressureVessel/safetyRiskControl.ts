import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getHead,
  getBody,
  getFlat,
  saveInfo,
  updateInfo,
  delInfo,
  querySafetyRiskControlConfig,
  sendApproval
} from "@/services/quality/pressureVessel/safetyRiskControl";

/**
 * 定义state类型
 */
export interface IPVQAStaffNominationStateType { }

/**
 * 定义Model数据类型
 */
export interface IPVQAStaffNominationModelType {
  namespace: string;
  state: IPVQAStaffNominationStateType;
  effects: {
    getHead: Effect;
    getBody: Effect;
    getFlat: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    querySafetyRiskControlConfig: Effect;
    sendApproval: Effect;
  };

  reducers: {};
}

/**
 * 特种设备质量安全风险管控清单
 */
const PVQAStaffNominationModel: IPVQAStaffNominationModelType = {
  namespace: "SafetyRiskControl",

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
    *getFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getFlat, payload);
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
    *querySafetyRiskControlConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySafetyRiskControlConfig, payload);
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

export default PVQAStaffNominationModel;
