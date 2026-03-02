import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityMonthlyQualityStatistics,
  addQualityMonthlyQualityStatistics,
  updateQualityMonthlyQualityStatistics,
  deleteQualityMonthlyQualityStatistics,
} from "@/services/quality/qualityReport/qualityDataAnalysis/qualityDataStatistics/qualityMonthlyQualityStatistics";

/**
 * 定义state类型
 */
export interface IQualityMonthlyQualityStatisticsStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityMonthlyQualityStatisticsModelType {
  namespace: string;
  state: IQualityMonthlyQualityStatisticsStateType;
  effects: {
    getQualityMonthlyQualityStatistics: Effect;
    addQualityMonthlyQualityStatistics: Effect;
    updateQualityMonthlyQualityStatistics: Effect;
    deleteQualityMonthlyQualityStatistics: Effect;
  };

  reducers: {};
}

/**
 * 质量数据统计表
 */
const QualityMonthlyQualityStatisticsModel: IQualityMonthlyQualityStatisticsModelType = {
  namespace: "qualityMonthlyQualityStatistics",

  state: {},

  effects: {
    *getQualityMonthlyQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityMonthlyQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityMonthlyQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityMonthlyQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityMonthlyQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityMonthlyQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityMonthlyQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityMonthlyQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityMonthlyQualityStatisticsModel;
