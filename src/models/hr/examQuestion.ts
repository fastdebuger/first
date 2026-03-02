import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";
import {
  getExamQuestion,
} from '@/services/hr/exam';

/**
 * 定义state类型
 */
export interface IhrExamStateType {}

/**
 * 定义Model数据类型
 */
export interface IhrExamModelType {
  namespace: string;
  state: IhrExamStateType;
  effects: {
    getExamQuestion: Effect;
  };

  reducers: {};
}

/**
 * 课程信息
 */
const HrExamModel: IhrExamModelType = {
  namespace: "examQuestion",

  state: {},

  effects: {
    *getExamQuestion({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExamQuestion, payload);
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

export default HrExamModel;
