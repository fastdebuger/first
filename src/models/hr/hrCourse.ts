import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryHrCourse,
  addHrCourse,
  delHrCourse,
  updateHrCourse,
  importHrCourse,
} from "@/services/hr/hrCourse";

/**
 * 定义state类型
 */
export interface IHrCourseStateType {}

/**
 * 定义Model数据类型
 */
export interface IHrCourseModelType {
  namespace: string;
  state: IHrCourseStateType;
  effects: {
    queryHrCourse: Effect;
    addHrCourse: Effect;
    delHrCourse: Effect;
    updateHrCourse: Effect;
    importHrCourse: Effect;
  };

  reducers: {};
}

/**
 * 课程信息
 */
const HrCourseModel: IHrCourseModelType = {
  namespace: "hrCourse",

  state: {},

  effects: {
    *queryHrCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryHrCourse, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addHrCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addHrCourse, payload);
      if (callback) {
        callback(response);
      }
    },
    *delHrCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delHrCourse, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateHrCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateHrCourse, payload);
      if (callback) {
        callback(response);
      }
    },
    *importHrCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importHrCourse, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default HrCourseModel;
