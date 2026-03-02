import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";

import {
  getInfo,
  saveInfo,
  updateInfo,
  delInfo,
  updateDetail,
  sendApproval,
  saveDetail,
  getDetailInfo,
  getUserDeductionDetail,
} from "@/services/SafetyGreen/Workpoionts";

/**
 * 定义state类型
 */
export interface IWorkpoiontsStateType { }

/**
 * 定义Model数据类型
 */
export interface IWorkpoiontsModelType {
  namespace: string;
  state: IWorkpoiontsStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    updateDetail: Effect;
    sendApproval: Effect;
    saveDetail: Effect;
    getDetailInfo: Effect;
    getUserDeductionDetail: Effect;
  };

  reducers: {};
}

/**
 * 记分管理
 */
const WorkpoiontsModel: IWorkpoiontsModelType = {
  namespace: "workpoionts",

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
    *getDetailInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getDetailInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getUserDeductionDetail({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getUserDeductionDetail, payload);
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
    *updateDetail({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateDetail, payload);
      if (callback) {
        callback(response);
      }
    },
    *sendApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendApproval, payload);
      if (callback) {
        callback(response);
      }
    },
    *saveDetail({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveDetail, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default WorkpoiontsModel;
