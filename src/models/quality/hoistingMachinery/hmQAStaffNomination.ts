import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getHead,
  getBody,
  getFlat,
  saveInfo,
  updateInfo,
  delInfo,
  querySpecialEquipmentPostConfig,
  sendApproval
} from "@/services/quality/hoistingMachinery/hmQAStaffNomination";

/**
 * 定义state类型
 */
export interface IHMQAStaffNominationStateType { }

/**
 * 定义Model数据类型
 */
export interface IHMQAStaffNominationModelType {
  namespace: string;
  state: IHMQAStaffNominationStateType;
  effects: {
    getHead: Effect;
    getBody: Effect;
    getFlat: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
    querySpecialEquipmentPostConfig: Effect;
    sendApproval: Effect;
  };

  reducers: {};
}

/**
 * 起重机械质保体系责任人员推荐表
 */
const HMQAStaffNominationModel: IHMQAStaffNominationModelType = {
  namespace: "hmQAStaffNomination",

  state: {},

  effects: {
    *getHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getFlat, payload);
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
    *querySpecialEquipmentPostConfig({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(querySpecialEquipmentPostConfig, payload);
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
  },
  reducers: {},
};

export default HMQAStaffNominationModel;
