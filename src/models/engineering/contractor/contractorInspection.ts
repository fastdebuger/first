import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryMonthlyOutput,
  addMonthlyOutput,
  updateMonthlyOutput,
  delMonthlyOutput,
  queryMonthlyOutputDetail,
  getExaminationConfig,
  getRemindInfo,
} from "@/services/engineering/contractor/contractorInspection";

/**
 * 定义state类型
 */
export interface IMonthlyOutputStateType {}

/**
 * 定义Model数据类型
 */
export interface IMonthlyOutputModelType {
  namespace: string;
  state: IMonthlyOutputStateType;
  effects: {
    queryMonthlyOutput: Effect;
    addMonthlyOutput: Effect;
    updateMonthlyOutput: Effect;
    delMonthlyOutput: Effect;
    queryMonthlyOutputDetail: Effect;
    getExaminationConfig: Effect;
    getRemindInfo: Effect;
  };

  reducers: {};
}

/**
 * 承包商施工作业过程中监督检查表信息
 */
const MonthlyOutputModel: IMonthlyOutputModelType = {
  namespace: "monthlyOutput",

  state: {},

  effects: {
    *queryMonthlyOutput({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryMonthlyOutput, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMonthlyOutput({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMonthlyOutput, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateMonthlyOutput({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMonthlyOutput, payload);
      if (callback) {
        callback(response);
      }
    },
    *delMonthlyOutput({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delMonthlyOutput, payload);
      if (callback) {
        callback(response);
      }
    },
    *queryMonthlyOutputDetail({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryMonthlyOutputDetail, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getExaminationConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExaminationConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getRemindInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getRemindInfo, payload);
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

export default MonthlyOutputModel;

