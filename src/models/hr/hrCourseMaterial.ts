import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryHrCourseMaterial,
  addHrCourseMaterial,
  delHrCourseMaterial,
  updateHrCourseMaterial,
  importHrCourseMaterial,
} from "@/services/hr/hrCourseMaterial";

/**
 * 定义state类型
 */
export interface IHrCourseMaterialStateType {}

/**
 * 定义Model数据类型
 */
export interface IHrCourseMaterialModelType {
  namespace: string;
  state: IHrCourseMaterialStateType;
  effects: {
    queryHrCourseMaterial: Effect;
    addHrCourseMaterial: Effect;
    delHrCourseMaterial: Effect;
    updateHrCourseMaterial: Effect;
    importHrCourseMaterial: Effect;
  };

  reducers: {};
}

/**
 * 课程资料
 */
const HrCourseMaterialModel: IHrCourseMaterialModelType = {
  namespace: "hrCourseMaterial",

  state: {},

  effects: {
    *queryHrCourseMaterial({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryHrCourseMaterial, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addHrCourseMaterial({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addHrCourseMaterial, payload);
      if (callback) {
        callback(response);
      }
    },
    *delHrCourseMaterial({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delHrCourseMaterial, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateHrCourseMaterial({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateHrCourseMaterial, payload);
      if (callback) {
        callback(response);
      }
    },
    *importHrCourseMaterial({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importHrCourseMaterial, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default HrCourseMaterialModel;
