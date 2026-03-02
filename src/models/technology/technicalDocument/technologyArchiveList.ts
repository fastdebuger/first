import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryTechnologyArchiveListHead,
  queryTechnologyArchiveListBody,
  queryTechnologyArchiveListFlat,
  addTechnologyArchiveList,
  updateTechnologyArchiveList,
  delTechnologyArchiveList,
  startApproval,
  queryTechnologyArchiveListStatistics
} from "@/services/technology/technicalDocument/technologyArchiveList";

/**
 * 定义state类型
 */
export interface ITechnologyArchiveListStateType { }

/**
 * 定义Model数据类型
 */
export interface ITechnologyArchiveListModelType {
  namespace: string;
  state: ITechnologyArchiveListStateType;
  effects: {
    queryTechnologyArchiveListHead: Effect;
    queryTechnologyArchiveListBody: Effect;
    queryTechnologyArchiveListFlat: Effect;
    addTechnologyArchiveList: Effect;
    updateTechnologyArchiveList: Effect;
    delTechnologyArchiveList: Effect;
    startApproval: Effect;
    queryTechnologyArchiveListStatistics: Effect;
  };

  reducers: {};
}

/**
 * 归档清单
 */
const TechnologyArchiveListModel: ITechnologyArchiveListModelType = {
  namespace: "technologyArchiveList",

  state: {},

  effects: {
    *queryTechnologyArchiveListHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTechnologyArchiveListHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryTechnologyArchiveListBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTechnologyArchiveListBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryTechnologyArchiveListFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTechnologyArchiveListFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addTechnologyArchiveList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addTechnologyArchiveList, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateTechnologyArchiveList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateTechnologyArchiveList, payload);
      if (callback) {
        callback(response);
      }
    },
    *delTechnologyArchiveList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delTechnologyArchiveList, payload);
      if (callback) {
        callback(response);
      }
    },
    *startApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApproval, payload);
      if (callback) {
        callback(response);
      }
    },
    *queryTechnologyArchiveListStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTechnologyArchiveListStatistics, payload);
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

export default TechnologyArchiveListModel;
