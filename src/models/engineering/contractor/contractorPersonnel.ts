import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getPersonInfo,
  addPersonInfo,
  updatePersonInfo,
  deletePersonInfo,
  importPersonInfo,
  blockPerson,
  approvalPersonBlackList,
  getcontractNoQuery,
  getPersonBlackList,
} from "@/services/engineering/contractor/contractorPersonnel";

/**
 * 定义state类型
 */
export interface IPositionStateType {}

/**
 * 定义Model数据类型
 */
export interface IPositionModelType {
  namespace: string;
  state: IPositionStateType;
  effects: {
    getPersonInfo: Effect;
    addPersonInfo: Effect;
    updatePersonInfo: Effect;
    deletePersonInfo: Effect;
    importPersonInfo: Effect;
    blockPerson: Effect;
    approvalPersonBlackList: Effect;
    getcontractNoQuery: Effect;
    getPersonBlackList: Effect;
  };

  reducers: {};
}

/**
 * 承办商人员信息
 */
const PositionModel: IPositionModelType = {
  namespace: "personInfo",

  state: {},

  effects: {
    *getPersonInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPersonInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPersonInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPersonInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePersonInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePersonInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePersonInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deletePersonInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *importPersonInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importPersonInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *blockPerson({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(blockPerson, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *approvalPersonBlackList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(approvalPersonBlackList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getcontractNoQuery({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getcontractNoQuery, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getPersonBlackList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPersonBlackList, payload);
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

export default PositionModel;
