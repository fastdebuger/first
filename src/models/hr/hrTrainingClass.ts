import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryHrTrainingClass,
  addHrTrainingClass,
  delHrTrainingClass,
  updateHrTrainingClass,
  importHrTrainingClass,
} from "@/services/hr/hrTrainingClass";

/**
 * 定义state类型
 */
export interface IHrTrainingClassStateType {}

/**
 * 定义Model数据类型
 */
export interface IHrTrainingClassModelType {
  namespace: string;
  state: IHrTrainingClassStateType;
  effects: {
    queryHrTrainingClass: Effect;
    addHrTrainingClass: Effect;
    delHrTrainingClass: Effect;
    updateHrTrainingClass: Effect;
    importHrTrainingClass: Effect;
  };

  reducers: {};
}

/**
 * 培训班
 */
const HrTrainingClassModel: IHrTrainingClassModelType = {
  namespace: "hrTrainingClass",

  state: {},

  effects: {
    *queryHrTrainingClass({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryHrTrainingClass, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addHrTrainingClass({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addHrTrainingClass, payload);
      if (callback) {
        callback(response);
      }
    },
    *delHrTrainingClass({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delHrTrainingClass, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateHrTrainingClass({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateHrTrainingClass, payload);
      if (callback) {
        callback(response);
      }
    },
    *importHrTrainingClass({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importHrTrainingClass, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default HrTrainingClassModel;
