import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityNcCorrectiveAction,
  addQualityNcCorrectiveAction,
  updateQualityNcCorrectiveAction,
  deleteQualityNcCorrectiveAction,
} from "@/services/quality/qualityReport/qualityDataAnalysis/qualityDataStatistics/qualityNcCorrectiveAction";

/**
 * 定义state类型
 */
export interface IQualityNcCorrectiveActionStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityNcCorrectiveActionModelType {
  namespace: string;
  state: IQualityNcCorrectiveActionStateType;
  effects: {
    getQualityNcCorrectiveAction: Effect;
    addQualityNcCorrectiveAction: Effect;
    updateQualityNcCorrectiveAction: Effect;
    deleteQualityNcCorrectiveAction: Effect;
  };

  reducers: {};
}

/**
 * 不合格项纠正措施记录
 */
const QualityNcCorrectiveActionModel: IQualityNcCorrectiveActionModelType = {
  namespace: "qualityNcCorrectiveAction",

  state: {},

  effects: {
    *getQualityNcCorrectiveAction({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityNcCorrectiveAction, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityNcCorrectiveAction({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityNcCorrectiveAction, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityNcCorrectiveAction({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityNcCorrectiveAction, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityNcCorrectiveAction({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityNcCorrectiveAction, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityNcCorrectiveActionModel;
