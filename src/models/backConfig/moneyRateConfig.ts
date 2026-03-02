import type { Effect } from 'umi';
import {
  getCurrencyExchangeRateConfig,
  addCurrencyExchangeRateConfig,
  deleteCurrencyExchangeRateConfig,
  updateCurrencyExchangeRateConfig,

} from '@/services/backConfig/moneyRateConfig';
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
    getCurrencyExchangeRateConfig: Effect;
    addCurrencyExchangeRateConfig: Effect;
    deleteCurrencyExchangeRateConfig: Effect;
    updateCurrencyExchangeRateConfig: Effect;
  };
  reducers: {};
}

const ExpenditureModel: CommonModalType = {
  namespace: 'moneyRateConfig',

  state: {},

  effects: {
    *getCurrencyExchangeRateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCurrencyExchangeRateConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addCurrencyExchangeRateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addCurrencyExchangeRateConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteCurrencyExchangeRateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteCurrencyExchangeRateConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateCurrencyExchangeRateConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateCurrencyExchangeRateConfig, payload);
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
