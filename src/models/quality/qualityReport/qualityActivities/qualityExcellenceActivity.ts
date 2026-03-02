import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityExcellenceActivity,
  addQualityExcellenceActivity,
  updateQualityExcellenceActivity,
  deleteQualityExcellenceActivity,
} from "@/services/quality/qualityReport/qualityActivities/qualityExcellenceActivity";

/**
 * 定义state类型
 */
export interface IQualityExcellenceActivityStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityExcellenceActivityModelType {
  namespace: string;
  state: IQualityExcellenceActivityStateType;
  effects: {
    getQualityExcellenceActivity: Effect;
    addQualityExcellenceActivity: Effect;
    updateQualityExcellenceActivity: Effect;
    deleteQualityExcellenceActivity: Effect;
  };

  reducers: {};
}

/**
 * 创优活动开展情况
 */
const QualityExcellenceActivityModel: IQualityExcellenceActivityModelType = {
  namespace: "qualityExcellenceActivity",

  state: {},

  effects: {
    *getQualityExcellenceActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityExcellenceActivity, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityExcellenceActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityExcellenceActivity, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityExcellenceActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityExcellenceActivity, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityExcellenceActivity({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityExcellenceActivity, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityExcellenceActivityModel;
