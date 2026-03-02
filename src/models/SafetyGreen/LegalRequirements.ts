import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getNewLawInfo,
  addLawInfo,
  sendLawApproval,
  queryAllLawList,
  updateLawVersion,
  updateLawInfo,
  delLawInfo,
  getWorkAnnual,
  saveWorkAnnual,
  updateWorkAnnual,
  getWorkDay,
  saveWorkDay,
  updateWorkDay,
  importLawInfo,
  saveBatch
} from "@/services/SafetyGreen/LegalRequirements";

/**
 * 定义state类型
 */
export interface IPurchaseStateType { }

/**
 * 定义Model数据类型
 */
export interface IPurchaseModelType {
  namespace: string;
  state: IPurchaseStateType;
  effects: {
    getNewLawInfo: Effect;
    addLawInfo: Effect;
    sendLawApproval: Effect;
    queryAllLawList: Effect;
    updateLawVersion: Effect;
    updateLawInfo: Effect;
    delLawInfo: Effect;
    getWorkAnnual: Effect;
    saveWorkAnnual: Effect;
    updateWorkAnnual: Effect;
    getWorkDay: Effect;
    saveWorkDay: Effect;
    updateWorkDay: Effect;
    importLawInfo: Effect;
    saveBatch: Effect;
  };

  reducers: {};
}

/**
 * 供应商信息台账
 */
const PurchaseModel: IPurchaseModelType = {
  namespace: "LegalRequirements",

  state: {},

  effects: {
    *getNewLawInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getNewLawInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addLawInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addLawInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *sendLawApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendLawApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryAllLawList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryAllLawList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateLawVersion({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateLawVersion, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateLawInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateLawInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delLawInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delLawInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getWorkAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWorkAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveWorkAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveWorkAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateWorkAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWorkAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getWorkDay({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWorkDay, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveWorkDay({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveWorkDay, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateWorkDay({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWorkDay, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    // 
    *importLawInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importLawInfo, payload);
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

export default PurchaseModel;
