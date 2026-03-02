import type { Effect } from 'umi';
import {
  querySubProgressPaymentFlat,
  querySubProgressPaymentBody,
  addSubProgressPayment,
  addSubProgressPaymentNumber,
  delSubProgressPayment,
  updateSubProgressPaymentBody,
  exportSubProgressPaymentFlat
} from '@/services/costControl/progress/subcontractorProgress';
import type { ResponseGenerator } from '@/typings';
import type { Reducer } from '@@/plugin-dva/connect';


/**
 * 定义state类型
 */
export interface SubcontractorProgressType {
  maxNumber: number,
}

/**
 * 定义Modal数据类型
 */
export interface SubcontractorProgressModalType {
  namespace: string;
  state: SubcontractorProgressType;
  effects: {
    querySubProgressPaymentFlat: Effect;
    querySubProgressPaymentBody: Effect;
    addSubProgressPayment: Effect;
    addSubProgressPaymentNumber: Effect;
    delSubProgressPayment: Effect;
    updateSubProgressPaymentBody: Effect;
    exportSubProgressPaymentFlat: Effect;
  };
  reducers: {
    saveMaxNumber: Reducer<SubcontractorProgressType>
  };
}

const SubcontractorProgressModel: SubcontractorProgressModalType = {
  namespace: 'subcontractorProgress',

  state: {
    maxNumber: 0
  },

  effects: {
    *querySubProgressPaymentFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySubProgressPaymentFlat, payload);
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
    *querySubProgressPaymentBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySubProgressPaymentBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSubProgressPayment({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSubProgressPayment, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSubProgressPaymentNumber({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSubProgressPaymentNumber, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delSubProgressPayment({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delSubProgressPayment, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateSubProgressPaymentBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSubProgressPaymentBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *exportSubProgressPaymentFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(exportSubProgressPaymentFlat, payload);
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

export default SubcontractorProgressModel;
