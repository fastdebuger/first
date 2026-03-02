import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryHrLecturer,
  addHrLecturer,
  delHrLecturer,
  updateHrLecturer,
  importHrLecturer,
} from "@/services/hr/hrLecturer";

/**
 * 定义state类型
 */
export interface IHrLecturerStateType {}

/**
 * 定义Model数据类型
 */
export interface IHrLecturerModelType {
  namespace: string;
  state: IHrLecturerStateType;
  effects: {
    queryHrLecturer: Effect;
    addHrLecturer: Effect;
    delHrLecturer: Effect;
    updateHrLecturer: Effect;
    importHrLecturer: Effect;
  };

  reducers: {};
}

/**
 * 讲师表
 */
const HrLecturerModel: IHrLecturerModelType = {
  namespace: "hrLecturer",

  state: {},

  effects: {
    *queryHrLecturer({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryHrLecturer, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addHrLecturer({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addHrLecturer, payload);
      if (callback) {
        callback(response);
      }
    },
    *delHrLecturer({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delHrLecturer, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateHrLecturer({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateHrLecturer, payload);
      if (callback) {
        callback(response);
      }
    },
    *importHrLecturer({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importHrLecturer, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default HrLecturerModel;
