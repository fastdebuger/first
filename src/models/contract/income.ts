import type { Effect } from 'umi';
import {
  getIncomeInfo,
  addIncomeInfo,
  updateIncomeInfo,
  deleteIncomeInfo,
  getPriceLevel,
  deletePriceLevel,
  updatePriceLevel,
  addPriceLevel,
  getIncomeInfoLog,
  queryProgressPaymentMaxNumber,
  importIncomeInfo,
  queryIncomeInfoWeeklyStatus,
  batchAddOutInfo,
  batchAddIncomeInfo,
  synContractIncomeInfo,
  deleteIncomeInfoB
} from '@/services/contract/income';
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
    getIncomeInfo: Effect;
    addIncomeInfo: Effect;
    updateIncomeInfo: Effect;
    deleteIncomeInfo: Effect;
    getPriceLevel: Effect;
    deletePriceLevel: Effect;
    updatePriceLevel: Effect;
    addPriceLevel: Effect;
    getIncomeInfoLog: Effect;
    queryProgressPaymentMaxNumber: Effect;
    importIncomeInfo: Effect;
    queryIncomeInfoWeeklyStatus: Effect;
    batchAddOutInfo: Effect;
    batchAddIncomeInfo: Effect;
    synContractIncomeInfo: Effect;
    deleteIncomeInfoB: Effect;
  };
  reducers: {};
}

const ExpenditureModel: CommonModalType = {
  namespace: 'income',

  state: {},

  effects: {
    *getIncomeInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getIncomeInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addIncomeInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addIncomeInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateIncomeInfo({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updateIncomeInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteIncomeInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteIncomeInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteIncomeInfoB({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteIncomeInfoB, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *getPriceLevel({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPriceLevel, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deletePriceLevel({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deletePriceLevel, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updatePriceLevel({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePriceLevel, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPriceLevel({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPriceLevel, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getIncomeInfoLog({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getIncomeInfoLog, payload);
      response.rows = response?.result || [];
      response.total = response?.result.length || 0;
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryProgressPaymentMaxNumber({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryProgressPaymentMaxNumber, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *importIncomeInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importIncomeInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryIncomeInfoWeeklyStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryIncomeInfoWeeklyStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *batchAddOutInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(batchAddOutInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *batchAddIncomeInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(batchAddIncomeInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *synContractIncomeInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(synContractIncomeInfo, payload);
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
