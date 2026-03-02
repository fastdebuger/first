import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  saveBatch,  
  updateInfo,  
  delInfo,  
} from "@/services/quality/pressureVessel/seOnlineNotification";

/**
 * 定义state类型
 */
export interface ISEOnlineNotificationStateType {}

/**
 * 定义Model数据类型
 */
export interface ISEOnlineNotificationModelType {
  namespace: string;
  state: ISEOnlineNotificationStateType;
  effects: {
    getInfo: Effect;
    saveBatch: Effect;
    updateInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 特种设备网上告知相关信息统计表
 */
const SEOnlineNotificationModel: ISEOnlineNotificationModelType = {
  namespace: "SEOnlineNotification",

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

export default SEOnlineNotificationModel;
