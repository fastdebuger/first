import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,
  saveInfo,
  updateInfo,
  delInfo,
  getApprovalList,
  sendApproval,
  saveTouchViewsInfo,
  getStats,
  getExpSharingPassAndStatsInfo
} from "@/services/SafetyGreen/LessonsLearned";

/**
 * 定义state类型
 */
export interface IExperienceStateType { }

/**
 * 定义Model数据类型
 */
export interface IExperienceModelType {
  namespace: string;
  state: IExperienceStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    getApprovalList: Effect;
    sendApproval: Effect;
    saveTouchViewsInfo: Effect;
    getStats: Effect;
    getExpSharingPassAndStatsInfo: Effect;
  };

  reducers: {};
}

/**
 * 经验分享
 */
const ExperienceModel: IExperienceModelType = {
  namespace: "experience",

  state: {},

  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *sendApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveTouchViewsInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveTouchViewsInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getStats({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getStats, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getApprovalList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getApprovalList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getExpSharingPassAndStatsInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExpSharingPassAndStatsInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
  },
  reducers: {},
};

export default ExperienceModel;
