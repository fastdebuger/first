import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityTechServiceQuality,
  addQualityTechServiceQuality,
  updateQualityTechServiceQuality,
  deleteQualityTechServiceQuality,
} from "@/services/quality/qualityReport/overallQualityProducts/qualityTechServiceQuality";

/**
 * 定义state类型
 */
export interface IQualityTechServiceQualityStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityTechServiceQualityModelType {
  namespace: string;
  state: IQualityTechServiceQualityStateType;
  effects: {
    getQualityTechServiceQuality: Effect;
    addQualityTechServiceQuality: Effect;
    updateQualityTechServiceQuality: Effect;
    deleteQualityTechServiceQuality: Effect;
  };

  reducers: {};
}

/**
 * 技术服务质量情况
 */
const QualityTechServiceQualityModel: IQualityTechServiceQualityModelType = {
  namespace: "qualityTechServiceQuality",

  state: {},

  effects: {
    *getQualityTechServiceQuality({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityTechServiceQuality, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityTechServiceQuality({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityTechServiceQuality, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityTechServiceQuality({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityTechServiceQuality, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityTechServiceQuality({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityTechServiceQuality, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityTechServiceQualityModel;
