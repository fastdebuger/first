import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityExperience,
  addQualityExperience,
  updateQualityExperience,
  deleteQualityExperience,
  queryDataExist
} from "@/services/quality/qualityReport/qualityExperience";

/**
 * 定义state类型
 */
export interface IQualityExperienceStateType { }

/**
 * 定义Model数据类型
 */
export interface IQualityExperienceModelType {
  namespace: string;
  state: IQualityExperienceStateType;
  effects: {
    getQualityExperience: Effect;
    addQualityExperience: Effect;
    updateQualityExperience: Effect;
    deleteQualityExperience: Effect;
    queryDataExist: Effect
  };

  reducers: {};
}

/**
 * 质量经验分享
 */
const QualityExperienceModel: IQualityExperienceModelType = {
  namespace: "qualityExperience",

  state: {},

  effects: {
    *getQualityExperience({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityExperience, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryDataExist({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryDataExist, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityExperience({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityExperience, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityExperience({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityExperience, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityExperience({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityExperience, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityExperienceModel;
