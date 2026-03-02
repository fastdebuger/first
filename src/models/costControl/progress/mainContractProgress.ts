import type { Effect } from 'umi';
import {
  queryProgressPaymentFlat,
  addProgressPayment,
  addProgressPaymentNumber,
  delProgressPayment,
  updateProgressPaymentBody,
  exportProgressPaymentFlat,
  queryProgressPaymentBody
} from '@/services/costControl/progress/mainContractProgress';
import type { ResponseGenerator } from '@/typings';
import type { Reducer } from '@@/plugin-dva/connect';


/**
 * 定义state类型
 */
export interface CostControlType {
  maxNumber: number,
}

/**
 * 定义Modal数据类型
 */
export interface CostControlModalType {
  namespace: string;
  state: CostControlType;
  effects: {
    queryProgressPaymentFlat: Effect;
    addProgressPayment: Effect;
    addProgressPaymentNumber: Effect;
    delProgressPayment: Effect;
    updateProgressPaymentBody: Effect;
    exportProgressPaymentFlat: Effect;
    queryProgressPaymentBody: Effect;
  };
  reducers: {
    saveMaxNumber: Reducer<CostControlType>
  };
}

const ExpenditureModel: CostControlModalType = {
  namespace: 'costControl',

  state: {
    maxNumber: 0
  },

  effects: {
    *queryProgressPaymentFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryProgressPaymentFlat, payload);
      if (callback) {
        callback(response);
      }
      if (response.rows && response.rows.length > 0) {
        yield put({
          type: 'saveMaxNumber',
          payload: response.rows[0].maxNumber || [],
        });
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addProgressPayment({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addProgressPayment, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addProgressPaymentNumber({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addProgressPaymentNumber, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delProgressPayment({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delProgressPayment, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateProgressPaymentBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateProgressPaymentBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *exportProgressPaymentFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(exportProgressPaymentFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryProgressPaymentBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryProgressPaymentBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },


  },
  reducers: {
    saveMaxNumber(state, action) {
      return {
        ...state,
        maxNumber: action.payload,
      };
    },
  },
};

export default ExpenditureModel;
