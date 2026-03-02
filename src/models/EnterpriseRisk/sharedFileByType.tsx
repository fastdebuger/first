import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  saveInfo,  
  updateInfo,  
  delInfo,  
} from "@/services/EnterpriseRisk/sharedFileType";

/**
 * 定义state类型
 */
export interface ISharedFileStateType {}

/**
 * 定义Model数据类型
 */
export interface ISharedFileModelType {
  namespace: string;
  state: ISharedFileStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 共享文件
 */
const SharedFileModel: ISharedFileModelType = {
  namespace: "sharedFileByType",

  state: {},

  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      response.rows = response.result;
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
  },
  reducers: {},
};

export default SharedFileModel;
