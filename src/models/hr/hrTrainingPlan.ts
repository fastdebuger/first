import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryHrTrainingPlan,
  addHrTrainingPlan,
  delHrTrainingPlan,
  updateHrTrainingPlan,
  importHrTrainingPlan,
} from "@/services/hr/hrTrainingPlan";

/**
 * 定义state类型
 */
export interface IHrTrainingPlanStateType {}

/**
 * 定义Model数据类型
 */
export interface IHrTrainingPlanModelType {
  namespace: string;
  state: IHrTrainingPlanStateType;
  effects: {
    queryHrTrainingPlan: Effect;
    addHrTrainingPlan: Effect;
    delHrTrainingPlan: Effect;
    updateHrTrainingPlan: Effect;
    importHrTrainingPlan: Effect;
  };

  reducers: {};
}

/**
 * 培训计划
 */
const HrTrainingPlanModel: IHrTrainingPlanModelType = {
  namespace: "hrTrainingPlan",

  state: {},

  effects: {
    *queryHrTrainingPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryHrTrainingPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addHrTrainingPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addHrTrainingPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *delHrTrainingPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delHrTrainingPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateHrTrainingPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateHrTrainingPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *importHrTrainingPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importHrTrainingPlan, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default HrTrainingPlanModel;
