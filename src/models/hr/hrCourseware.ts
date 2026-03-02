import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryHrCourseware,
  addHrCourseware,
  delHrCourseware,
  updateHrCourseware,
  importHrCourseware,
} from "@/services/hr/hrCourseware";

/**
 * 定义state类型
 */
export interface IHrCoursewareStateType {}

/**
 * 定义Model数据类型
 */
export interface IHrCoursewareModelType {
  namespace: string;
  state: IHrCoursewareStateType;
  effects: {
    queryHrCourseware: Effect;
    addHrCourseware: Effect;
    delHrCourseware: Effect;
    updateHrCourseware: Effect;
    importHrCourseware: Effect;
  };

  reducers: {};
}

/**
 * 课件表
 */
const HrCoursewareModel: IHrCoursewareModelType = {
  namespace: "hrCourseware",

  state: {},

  effects: {
    *queryHrCourseware({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryHrCourseware, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addHrCourseware({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addHrCourseware, payload);
      if (callback) {
        callback(response);
      }
    },
    *delHrCourseware({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delHrCourseware, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateHrCourseware({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateHrCourseware, payload);
      if (callback) {
        callback(response);
      }
    },
    *importHrCourseware({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importHrCourseware, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default HrCoursewareModel;
