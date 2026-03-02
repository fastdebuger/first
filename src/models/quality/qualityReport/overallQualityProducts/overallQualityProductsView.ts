import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityProjectQualityOverview,
  addQualityProjectQualityOverview,
  updateQualityProjectQualityOverview,
  deleteQualityProjectQualityOverview,
  saveBatchProjectQualityOverview,
} from "@/services/quality/qualityReport/overallQualityProducts/overallQualityProductsView";

/**
 * 定义state类型
 */
export interface IQualityProjectQualityOverviewStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityProjectQualityOverviewModelType {
  namespace: string;
  state: IQualityProjectQualityOverviewStateType;
  effects: {
    getQualityProjectQualityOverview: Effect;
    addQualityProjectQualityOverview: Effect;
    saveBatchProjectQualityOverview: Effect;
    updateQualityProjectQualityOverview: Effect;
    deleteQualityProjectQualityOverview: Effect;
  };

  reducers: {};
}

/**
 * 工程产品总体质量概述
 */
const QualityProjectQualityOverviewModel: IQualityProjectQualityOverviewModelType = {
  namespace: "qualityProjectQualityOverview",

  state: {},

  effects: {
    *getQualityProjectQualityOverview({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityProjectQualityOverview, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityProjectQualityOverview({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityProjectQualityOverview, payload);
      if (callback) {
        callback(response);
      }
    },
    *saveBatchProjectQualityOverview({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveBatchProjectQualityOverview, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityProjectQualityOverview({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityProjectQualityOverview, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityProjectQualityOverview({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityProjectQualityOverview, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityProjectQualityOverviewModel;
