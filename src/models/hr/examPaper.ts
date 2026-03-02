import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getExamPaper,
  addExamPaper,
  updateExamPaper,
  deleteExamPaper,
  publishExamPaper,
} from "@/services/hr/exam";

/**
 * 定义state类型
 */
export interface IExamPaperStateType {}

/**
 * 定义Model数据类型
 */
export interface IExamPaperModelType {
  namespace: string;
  state: IExamPaperStateType;
  effects: {
    getExamPaper: Effect;
    addExamPaper: Effect;
    updateExamPaper: Effect;
    deleteExamPaper: Effect;
    publishExamPaper: Effect;
  };

  reducers: {};
}

/**
 * 考卷管理
 */
const ExamPaperModel: IExamPaperModelType = {
  namespace: "examPaper",

  state: {},

  effects: {
    *getExamPaper({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExamPaper, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addExamPaper({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addExamPaper, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateExamPaper({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateExamPaper, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteExamPaper({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteExamPaper, payload);
      if (callback) {
        callback(response);
      }
    },
    *publishExamPaper({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(publishExamPaper, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default ExamPaperModel;
