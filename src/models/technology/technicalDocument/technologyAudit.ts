import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getTechnologyBaseData,
  addTechnologyBaseData,
  updateTechnologyBaseData,
  deleteTechnologyBaseData,
  startApproval,
} from "@/services/technology/technicalDocument/technologyAudit";

/**
 * 定义state类型
 */
export interface ITechnologyBaseDataStateType {}

/**
 * 定义Model数据类型
 */
export interface ITechnologyBaseDataModelType {
  namespace: string;
  state: ITechnologyBaseDataStateType;
  effects: {
    getTechnologyBaseData: Effect;
    addTechnologyBaseData: Effect;
    updateTechnologyBaseData: Effect;
    deleteTechnologyBaseData: Effect;
    startApproval: Effect;
  };

  reducers: {};
}

/**
 * 技术管理审计
 */
const TechnologyBaseDataModel: ITechnologyBaseDataModelType = {
  namespace: "technologyBaseData",

  state: {},

  effects: {
    *getTechnologyBaseData({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getTechnologyBaseData, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addTechnologyBaseData({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addTechnologyBaseData, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateTechnologyBaseData({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateTechnologyBaseData, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteTechnologyBaseData({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteTechnologyBaseData, payload);
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
  },
  reducers: {},
};

export default TechnologyBaseDataModel;
