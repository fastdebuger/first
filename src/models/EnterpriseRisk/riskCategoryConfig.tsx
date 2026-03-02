import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  saveInfo,
  updateInfo,
  getInfo,
  delInfo,
} from "@/services/EnterpriseRisk/RiskCategoryConfig";

/**
 * 定义state类型
 */
export interface ICollectionOfRiskIncidentsType { }

/**
 * 定义Model数据类型
 */
export interface ICollectionOfRiskIncidentsModelType {
  namespace: string;
  state: ICollectionOfRiskIncidentsType;
  effects: {
    saveInfo: Effect;
    updateInfo: Effect;
    getInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 风险类别配置信息
 */
const CollectionOfRiskIncidentsModel: ICollectionOfRiskIncidentsModelType = {
  namespace: "RiskCategoryConfig",

  state: {},

  effects: {
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    }
  },
  reducers: {},
};

export default CollectionOfRiskIncidentsModel;
