import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityInspection,
  addQualityInspection,
  updateQualityInspection,
  deleteQualityInspection,
} from "@/services/quality/qualityReport/qualityActivities/qualityInspection";

/**
 * 定义state类型
 */
export interface IQualityInspectionStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityInspectionModelType {
  namespace: string;
  state: IQualityInspectionStateType;
  effects: {
    getQualityInspection: Effect;
    addQualityInspection: Effect;
    updateQualityInspection: Effect;
    deleteQualityInspection: Effect;
  };

  reducers: {};
}

/**
 * 质量大检查及专项检查情况
 */
const QualityInspectionModel: IQualityInspectionModelType = {
  namespace: "qualityInspection",

  state: {},

  effects: {
    *getQualityInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityInspection, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityInspection, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityInspection, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityInspection({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityInspection, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityInspectionModel;
