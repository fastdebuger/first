import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getConfig,  
  addConfig,  
  updateConfig,  
  deleteConfig,  
} from "@/services/materials/meetingManagement/meetingCondition";

/**
 * 定义state类型
 */
export interface IConfigStateType {}

/**
 * 定义Model数据类型
 */
export interface IConfigModelType {
  namespace: string;
  state: IConfigStateType;
  effects: {
    getConfig: Effect;
    addConfig: Effect;
    updateConfig: Effect;
    deleteConfig: Effect;
  };

  reducers: {};
}

/**
 * 会议上会条件设置
 */
const ConfigModel: IConfigModelType = {
  namespace: "config",

  state: {},

  effects: {
    *getConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteConfig, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default ConfigModel;
