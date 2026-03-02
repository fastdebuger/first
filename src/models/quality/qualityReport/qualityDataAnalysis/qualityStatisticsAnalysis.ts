import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityStatisticsAnalysis,
  addQualityStatisticsAnalysis,
  updateQualityStatisticsAnalysis,
  deleteQualityStatisticsAnalysis,
} from "@/services/quality/qualityReport/qualityDataAnalysis/qualityStatisticsAnalysis";

/**
 * 定义state类型
 */
export interface IQualityStatisticsAnalysisStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityStatisticsAnalysisModelType {
  namespace: string;
  state: IQualityStatisticsAnalysisStateType;
  effects: {
    getQualityStatisticsAnalysis: Effect;
    addQualityStatisticsAnalysis: Effect;
    updateQualityStatisticsAnalysis: Effect;
    deleteQualityStatisticsAnalysis: Effect;
  };

  reducers: {};
}

/**
 * 质量统计数据分析情况
 */
const QualityStatisticsAnalysisModel: IQualityStatisticsAnalysisModelType = {
  namespace: "qualityStatisticsAnalysis",

  state: {},

  effects: {
    *getQualityStatisticsAnalysis({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityStatisticsAnalysis, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityStatisticsAnalysis({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityStatisticsAnalysis, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityStatisticsAnalysis({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityStatisticsAnalysis, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityStatisticsAnalysis({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityStatisticsAnalysis, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityStatisticsAnalysisModel;
