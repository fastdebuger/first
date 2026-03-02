import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,
  saveInfo,
  updateInfo,
  delInfo,
} from "@/services/enterpriseRisk/dateConfig";

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
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 公司风险评估调查表
 */
const AnnualAssessmentModel: IAnnualAssessmentModelType = {
  namespace: "dateConfig",

  state: {},

  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
    },
   
  },
  reducers: {},
};

export default AnnualAssessmentModel;
