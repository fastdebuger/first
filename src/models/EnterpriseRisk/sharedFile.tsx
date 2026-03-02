import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  file,  
  updateInfo,  
  delInfo,  
} from "@/services/EnterpriseRisk/sharedFile";

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
    file: Effect;
    updateInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 共享文件
 */
const SharedFileModel: ISharedFileModelType = {
  namespace: "sharedFile",

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
    *file({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(file, payload);
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
