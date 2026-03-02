import type { Effect } from 'umi';
import {
  queryEngineeringVisaH,
  queryEngineeringVisaB,
  queryEngineeringVisaFlat,
  updateEngineeringVisa,
  delEngineeringVisa,
  addEngineeringVisa,
  queryEngineeringVisa
} from '@/services/costControl/visa/mainContractVisa';
import type { ResponseGenerator } from '@/typings';


/**
 * 定义state类型
 */
export interface CostControlType {
}

/**
 * 定义Modal数据类型
 */
export interface CostControlModalType {
  namespace: string;
  state: CostControlType;
  effects: {
    queryEngineeringVisaH: Effect;
    queryEngineeringVisaB: Effect;
    queryEngineeringVisaFlat: Effect;
    updateEngineeringVisa: Effect;
    delEngineeringVisa: Effect;
    addEngineeringVisa: Effect;
    queryEngineeringVisa: Effect;
  };
  reducers: {
  };
}

const ExpenditureModel: CostControlModalType = {
  namespace: 'visa',

  state: {},

  effects: {
    *queryEngineeringVisaH({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryEngineeringVisaH, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryEngineeringVisaB({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryEngineeringVisaB, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryEngineeringVisaFlat({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryEngineeringVisaFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updateEngineeringVisa, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(delEngineeringVisa, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(addEngineeringVisa, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(queryEngineeringVisa, payload);
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
