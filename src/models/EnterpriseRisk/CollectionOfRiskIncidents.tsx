import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  saveInfo,
  updateInfo,
  sendApproval,
  getInfo,
  queryRiskCategoryConfig,
  delInfo,
  saveBatch,
} from "@/services/enterpriseRisk/collectionOfRiskIncidents";

/**
 * 定义state类型
 */
export interface ICollectionOfRiskIncidentsType { }

/**
 * 定义Model数据类型
 */
export interface ICollectionOfRiskIncidentsModelType {
  namespace: string;
  state: ICollectionOfRiskIncidentsType;
  effects: {
    saveInfo: Effect;
    updateInfo: Effect;
    sendApproval: Effect;
    getInfo: Effect;
    queryRiskCategoryConfig: Effect;
    delInfo: Effect;
    saveBatch: Effect;
  };

  reducers: {};
}

/**
 * 风险事件收集
 */
const CollectionOfRiskIncidentsModel: ICollectionOfRiskIncidentsModelType = {
  namespace: "collectionOfRiskIncidents",

  state: {},

  effects: {
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *sendApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskCategoryConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskCategoryConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveBatch({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatch, payload);
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

export default CollectionOfRiskIncidentsModel;
