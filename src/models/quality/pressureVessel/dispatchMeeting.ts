import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  saveInfo,  
  updateInfo,  
  delInfo,  
  sendApproval,  
} from "@/services/quality/pressureVessel/dispatchMeeting";

/**
 * 定义state类型
 */
export interface IDispatchMeetingStateType {}

/**
 * 定义Model数据类型
 */
export interface IDispatchMeetingModelType {
  namespace: string;
  state: IDispatchMeetingStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    sendApproval: Effect;
  };

  reducers: {};
}

/**
 * 特种设备每月质量安全调度会议纪要信息
 */
const DispatchMeetingModel: IDispatchMeetingModelType = {
  namespace: "dispatchMeeting",

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

export default DispatchMeetingModel;
