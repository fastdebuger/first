import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityQcActivity,
  addQualityQcActivity,
  updateQualityQcActivity,
  deleteQualityQcActivity,
} from "@/services/quality/qualityReport/qualityActivities/qualityQcActivity";

/**
 * 定义state类型
 */
export interface IQualityQcActivityStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityQcActivityModelType {
  namespace: string;
  state: IQualityQcActivityStateType;
  effects: {
    getQualityQcActivity: Effect;
    addQualityQcActivity: Effect;
    updateQualityQcActivity: Effect;
    deleteQualityQcActivity: Effect;
  };

  reducers: {};
}

/**
 * QC小组活动开展情况
 */
const QualityQcActivityModel: IQualityQcActivityModelType = {
  namespace: "qualityQcActivity",

  state: {},

  effects: {
    *getQualityQcActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityQcActivity, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityQcActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityQcActivity, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityQcActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityQcActivity, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityQcActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityQcActivity, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityQcActivityModel;
