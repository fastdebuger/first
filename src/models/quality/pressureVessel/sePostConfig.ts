import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,  
  saveInfo,  
  updateInfo,  
  delInfo,  
} from "@/services/quality/pressureVessel/sePostConfig";

/**
 * 定义state类型
 */
export interface ISEPostConfigStateType {}

/**
 * 定义Model数据类型
 */
export interface ISEPostConfigModelType {
  namespace: string;
  state: ISEPostConfigStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 特种设备职务配置表信息
 */
const SEPostConfigModel: ISEPostConfigModelType = {
  namespace: "SEPostConfig",

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
  },
  reducers: {},
};

export default SEPostConfigModel;
