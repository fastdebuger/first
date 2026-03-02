import type { Effect } from 'umi';
import {
  queryContract,
  addContract,
  updateContract,
  deleteContract,
  queryObsTemplate,
  queryLog,
  importDataContract
} from '@/services/contract/expenditure';
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
    queryContract: Effect;
    addContract: Effect;
    updateContract: Effect;
    deleteContract: Effect;
    queryObsTemplate: Effect;
    queryLog: Effect;
    importDataContract: Effect;
  };
  reducers: {};
}

const ExpenditureModel: CommonModalType = {
  namespace: 'expenditure',

  state: {},

  effects: {
    *queryContract({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryContract, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryObsTemplate({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryObsTemplate, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addContract({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(addContract, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateContract({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updateContract, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteContract({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(deleteContract, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryLog({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryLog, payload);
      response.rows = response?.result || [];
      response.total = response?.result.length || 0;
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *importDataContract({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(importDataContract, payload);
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
