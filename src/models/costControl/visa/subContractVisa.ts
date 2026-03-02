import type { Effect } from 'umi';
import {
  querySubEngineeringVisaH,
  querySubEngineeringVisaB,
  querySubEngineeringVisaFlat,
  updateSubEngineeringVisa,
  delSubEngineeringVisa,
  addSubEngineeringVisa,
  querySubEngineeringVisa
} from '@/services/costControl/visa/subContractVisa';
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
    querySubEngineeringVisaH: Effect;
    querySubEngineeringVisaB: Effect;
    querySubEngineeringVisaFlat: Effect;
    updateSubEngineeringVisa: Effect;
    delSubEngineeringVisa: Effect;
    addSubEngineeringVisa: Effect;
    querySubEngineeringVisa: Effect;
  };
  reducers: {
  };
}

const ExpenditureModel: CostControlModalType = {
  namespace: 'visaSub',

  state: {},

  effects: {
    *querySubEngineeringVisaH({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(querySubEngineeringVisaH, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySubEngineeringVisaB({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(querySubEngineeringVisaB, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySubEngineeringVisaFlat({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(querySubEngineeringVisaFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateSubEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updateSubEngineeringVisa, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delSubEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(delSubEngineeringVisa, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSubEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(addSubEngineeringVisa, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySubEngineeringVisa({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(querySubEngineeringVisa, payload);
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
