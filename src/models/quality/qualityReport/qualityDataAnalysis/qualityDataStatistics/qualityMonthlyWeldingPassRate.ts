import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryQualityMonthlyWeldingPassRateHead,
  queryQualityMonthlyWeldingPassRateBody,
  queryQualityMonthlyWeldingPassRateFlat,
  addQualityMonthlyWeldingPassRate,
  updateQualityMonthlyWeldingPassRate,
  delQualityMonthlyWeldingPassRate,
} from "@/services/quality/qualityReport/qualityDataAnalysis/qualityDataStatistics/qualityMonthlyWeldingPassRate";

/**
 * 定义state类型
 */
export interface IQualityMonthlyWeldingPassRateStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityMonthlyWeldingPassRateModelType {
  namespace: string;
  state: IQualityMonthlyWeldingPassRateStateType;
  effects: {
    queryQualityMonthlyWeldingPassRateHead: Effect;
    queryQualityMonthlyWeldingPassRateBody: Effect;
    queryQualityMonthlyWeldingPassRateFlat: Effect;
    addQualityMonthlyWeldingPassRate: Effect;
    updateQualityMonthlyWeldingPassRate: Effect;
    delQualityMonthlyWeldingPassRate: Effect;
  };

  reducers: {};
}

/**
 * 月度焊接一次合格率统计表
 */
const QualityMonthlyWeldingPassRateModel: IQualityMonthlyWeldingPassRateModelType = {
  namespace: "qualityMonthlyWeldingPassRate",

  state: {},

  effects: {
    *queryQualityMonthlyWeldingPassRateHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualityMonthlyWeldingPassRateHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualityMonthlyWeldingPassRateBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualityMonthlyWeldingPassRateBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualityMonthlyWeldingPassRateFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualityMonthlyWeldingPassRateFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityMonthlyWeldingPassRate({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityMonthlyWeldingPassRate, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityMonthlyWeldingPassRate({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityMonthlyWeldingPassRate, payload);
      if (callback) {
        callback(response);
      }
    },
    *delQualityMonthlyWeldingPassRate({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delQualityMonthlyWeldingPassRate, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityMonthlyWeldingPassRateModel;
