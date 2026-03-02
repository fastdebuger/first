import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  querySupplierContractScoreHead,
  querySupplierContractScoreBody,
  querySupplierContractScoreFlat,
  addSupplierContractScoreHead,
  updateSupplierContractScore,
  delSupplierContractScore,
  addSupplierContractScoreBody,
  addSupplierContractScore,
} from "@/services/engineering/supplierContractScore";

/**
 * 定义state类型
 */
export interface ISupplierContractScoreStateType {}

/**
 * 定义Model数据类型
 */
export interface ISupplierContractScoreModelType {
  namespace: string;
  state: ISupplierContractScoreStateType;
  effects: {
    querySupplierContractScoreHead: Effect;
    querySupplierContractScoreBody: Effect;
    querySupplierContractScoreFlat: Effect;
    addSupplierContractScoreHead: Effect;
    updateSupplierContractScore: Effect;
    delSupplierContractScore: Effect;
    addSupplierContractScoreBody: Effect;
    addSupplierContractScore: Effect;
  };

  reducers: {};
}

/**
 * 供应商合同得分
 */
const SupplierContractScoreModel: ISupplierContractScoreModelType = {
  namespace: "supplierContractScore",

  state: {},

  effects: {
    *querySupplierContractScoreHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySupplierContractScoreHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySupplierContractScoreBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySupplierContractScoreBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySupplierContractScoreFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySupplierContractScoreFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSupplierContractScoreHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSupplierContractScoreHead, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSupplierContractScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSupplierContractScore, payload);
      if (callback) {
        callback(response);
      }
    },
    *delSupplierContractScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delSupplierContractScore, payload);
      if (callback) {
        callback(response);
      }
    },
    *addSupplierContractScoreBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSupplierContractScoreBody, payload);
      if (callback) {
        callback(response);
      }
    },
    *addSupplierContractScore({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSupplierContractScore, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default SupplierContractScoreModel;
