import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualitySeriousNonconformities,
  addQualitySeriousNonconformities,
  updateQualitySeriousNonconformities,
  deleteQualitySeriousNonconformities,
} from "@/services/quality/qualityReport/criticalNonconformities/qualitySeriousNonconformities";

/**
 * 定义state类型
 */
export interface IQualitySeriousNonconformitiesStateType { }

/**
 * 定义Model数据类型
 */
export interface IQualitySeriousNonconformitiesModelType {
  namespace: string;
  state: IQualitySeriousNonconformitiesStateType;
  effects: {
    getQualitySeriousNonconformities: Effect;
    addQualitySeriousNonconformities: Effect;
    updateQualitySeriousNonconformities: Effect;
    deleteQualitySeriousNonconformities: Effect;
  };

  reducers: {};
}

/**
 * 本月严重不合格品情况
 */
const QualitySeriousNonconformitiesModel: IQualitySeriousNonconformitiesModelType = {
  namespace: "qualitySeriousNonconformities",

  state: {},

  effects: {
    *getQualitySeriousNonconformities({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySeriousNonconformities, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualitySeriousNonconformities({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualitySeriousNonconformities, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualitySeriousNonconformities({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualitySeriousNonconformities, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualitySeriousNonconformities({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualitySeriousNonconformities, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualitySeriousNonconformitiesModel;
