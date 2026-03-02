import type { Effect } from 'umi';
import {
  getSysDict,
  getOwnerName,
  getOwnerUnitName,
  getZyyjImsFormNoConfig,
  updateZyyjImsFormNoConfig
} from '@/services/contract/basic';
import type { ResponseGenerator } from '@/typings';

/**
 * 定义state类型
 */
export interface CommonStateType { }

/**
 * 定义Modal数据类型
 */
export interface CommonModalType {
  namespace: string;
  state: CommonStateType;
  effects: {
    getSysDict: Effect;
    getOwnerName: Effect;
    getOwnerUnitName: Effect;
    getZyyjImsFormNoConfig: Effect;
    updateZyyjImsFormNoConfig: Effect;
  };
  reducers: {};
}

const ExpenditureModel: CommonModalType = {
  namespace: 'contractBasic',

  state: {},

  effects: {
    *getSysDict({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSysDict, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getOwnerName({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getOwnerName, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getOwnerUnitName({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getOwnerUnitName, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getZyyjImsFormNoConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getZyyjImsFormNoConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateZyyjImsFormNoConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateZyyjImsFormNoConfig, payload);
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

export default ExpenditureModel;
