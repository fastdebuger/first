import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityOtherQualityStatistics,
  addQualityOtherQualityStatistics,
  updateQualityOtherQualityStatistics,
  deleteQualityOtherQualityStatistics,
} from "@/services/quality/qualityReport/qualityDataAnalysis/qualityOtherQualityStatistics";

/**
 * 定义state类型
 */
export interface IQualityOtherQualityStatisticsStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityOtherQualityStatisticsModelType {
  namespace: string;
  state: IQualityOtherQualityStatisticsStateType;
  effects: {
    getQualityOtherQualityStatistics: Effect;
    addQualityOtherQualityStatistics: Effect;
    updateQualityOtherQualityStatistics: Effect;
    deleteQualityOtherQualityStatistics: Effect;
  };

  reducers: {};
}

/**
 * 其它质量数据统计情况
 */
const QualityOtherQualityStatisticsModel: IQualityOtherQualityStatisticsModelType = {
  namespace: "qualityOtherQualityStatistics",

  state: {},

  effects: {
    *getQualityOtherQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityOtherQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityOtherQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityOtherQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityOtherQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityOtherQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityOtherQualityStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityOtherQualityStatistics, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityOtherQualityStatisticsModel;
