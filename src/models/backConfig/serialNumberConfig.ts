import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";

import {
  getSerialNumberConfig,
  addSerialNumberConfig,
  updateSerialNumberConfig,
  deleteSerialNumberConfig,
} from "@/services/backConfig/serialNumberConfig";

/**
 * 定义state类型
 */
export interface ISerialNumberConfigStateType {}

/**
 * 定义Model数据类型
 */
export interface ISerialNumberConfigModelType {
  namespace: string;
  state: ISerialNumberConfigStateType;
  effects: {
    getSerialNumberConfig: Effect;
    addSerialNumberConfig: Effect;
    updateSerialNumberConfig: Effect;
    deleteSerialNumberConfig: Effect;
  };

  reducers: {};
}

/**
 * 单据号配置
 */
const SerialNumberConfigModel: ISerialNumberConfigModelType = {
  namespace: "serialNumberConfig",

  state: {},

  effects: {
    *getSerialNumberConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSerialNumberConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSerialNumberConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSerialNumberConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSerialNumberConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSerialNumberConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteSerialNumberConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSerialNumberConfig, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default SerialNumberConfigModel;
