import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  saveInfo,  
  sendApproval,  
  delInfo,  
  updateInfo,
  checkDailyReport  
} from "@/services/quality/pressureVessel/qualitySafetyWeekCheck";

/**
 * 定义state类型
 */
export interface IQualitySafetyWeekCheckStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualitySafetyWeekCheckModelType {
  namespace: string;
  state: IQualitySafetyWeekCheckStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    sendApproval: Effect;
    delInfo: Effect;
    updateInfo: Effect;
    checkDailyReport: Effect;
  };

  reducers: {};
}

/**
 * 特种设备每周质量安全检查记录信息
 */
const QualitySafetyWeekCheckModel: IQualitySafetyWeekCheckModelType = {
  namespace: "qualitySafetyWeekCheck",

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
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
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
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
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
    *checkDailyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(checkDailyReport, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualitySafetyWeekCheckModel;
