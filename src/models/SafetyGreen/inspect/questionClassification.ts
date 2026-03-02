import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryQualitySafetyFactorTypeHead,
  queryQualitySafetyFactorTypeBody,
  queryQualitySafetyFactorTypeFlat,
  addQualitySafetyFactorType,
  updateQualitySafetyFactorType,
  delQualitySafetyFactorType,
} from "@/services/safetyGreen/inspect/questionClassification";

/**
 * 定义state类型
 */
export interface IQualitySafetyFactorTypeStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualitySafetyFactorTypeModelType {
  namespace: string;
  state: IQualitySafetyFactorTypeStateType;
  effects: {
    queryQualitySafetyFactorTypeHead: Effect;
    queryQualitySafetyFactorTypeBody: Effect;
    queryQualitySafetyFactorTypeFlat: Effect;
    addQualitySafetyFactorType: Effect;
    updateQualitySafetyFactorType: Effect;
    delQualitySafetyFactorType: Effect;
  };

  reducers: {};
}

/**
 * 问题归类配置
 */
const QualitySafetyFactorTypeModel: IQualitySafetyFactorTypeModelType = {
  namespace: "qualitySafetyFactorType",

  state: {},

  effects: {
    *queryQualitySafetyFactorTypeHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualitySafetyFactorTypeHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualitySafetyFactorTypeBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualitySafetyFactorTypeBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualitySafetyFactorTypeFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualitySafetyFactorTypeFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualitySafetyFactorType({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualitySafetyFactorType, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualitySafetyFactorType({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualitySafetyFactorType, payload);
      if (callback) {
        callback(response);
      }
    },
    *delQualitySafetyFactorType({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delQualitySafetyFactorType, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualitySafetyFactorTypeModel;
