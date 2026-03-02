import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";

import {
  queryContingencyPlanConfigHead,
  queryContingencyPlanConfigBody,
  queryContingencyPlanConfigFlat,
  addContingencyPlanConfig,
  updateContingencyPlanConfig,
  delContingencyPlanConfig,
  getContingencyPlan,
  addContingencyPlan,
  updateContingencyPlan,
  deleteContingencyPlan,
  getContingencyPlanHead,
  getContingencyPlanBody,
  getContingencyPlanFlat,
  updateContingencyPlanB
} from "@/services/SafetyGreen/emergencyplan";

/**
 * 定义state类型
 */
export interface IWorkpoiontsStateType { }

/**
 * 定义Model数据类型
 */
export interface IWorkpoiontsModelType {
  namespace: string;
  state: IWorkpoiontsStateType;
  effects: {
    queryContingencyPlanConfigHead: Effect;
    queryContingencyPlanConfigBody: Effect;
    queryContingencyPlanConfigFlat: Effect;
    addContingencyPlanConfig: Effect;
    updateContingencyPlanConfig: Effect;
    delContingencyPlanConfig: Effect;
    getContingencyPlan: Effect;
    addContingencyPlan: Effect;
    updateContingencyPlan: Effect;
    deleteContingencyPlan: Effect;
    getContingencyPlanHead: Effect;
    getContingencyPlanBody: Effect;
    getContingencyPlanFlat: Effect;
    updateContingencyPlanB: Effect;
  };

  reducers: {};
}

/**
 * 应急预案
 */
const WorkpoiontsModel: IWorkpoiontsModelType = {
  namespace: "emergencyplan",

  state: {},

  effects: {
    *queryContingencyPlanConfigHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryContingencyPlanConfigHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryContingencyPlanConfigBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryContingencyPlanConfigBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryContingencyPlanConfigFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryContingencyPlanConfigFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addContingencyPlanConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addContingencyPlanConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateContingencyPlanConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateContingencyPlanConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delContingencyPlanConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delContingencyPlanConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getContingencyPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getContingencyPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addContingencyPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addContingencyPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateContingencyPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateContingencyPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateContingencyPlanB({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateContingencyPlanB, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteContingencyPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteContingencyPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getContingencyPlanHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getContingencyPlanHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getContingencyPlanBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getContingencyPlanBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getContingencyPlanFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getContingencyPlanFlat, payload);
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

export default WorkpoiontsModel;
