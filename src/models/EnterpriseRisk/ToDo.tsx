import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryUserToDoInfo,
  sendRiskEventsTask,
  sendRiskAssessmentTask,
  sendRiskEvaluateTask
} from "@/services/enterpriseRisk/toDo";

/**
 * 定义state类型
 */
export interface IAnnualAssessmentStateType { }

/**
 * 定义Model数据类型
 */
export interface IAnnualAssessmentModelType {
  namespace: string;
  state: IAnnualAssessmentStateType;
  effects: {
    queryUserToDoInfo: Effect;
    sendRiskEventsTask: Effect;
    sendRiskAssessmentTask: Effect;
    sendRiskEvaluateTask: Effect;
  };

  reducers: {};
}

/**
 * 公司风险评估调查表
 */
const AnnualAssessmentModel: IAnnualAssessmentModelType = {
  namespace: "EnterpriseRiskToDo",

  state: {},

  effects: {
    *queryUserToDoInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryUserToDoInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *sendRiskEventsTask({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendRiskEventsTask, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *sendRiskAssessmentTask({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendRiskAssessmentTask, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *sendRiskEvaluateTask({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendRiskEvaluateTask, payload);
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

export default AnnualAssessmentModel;
