import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryPoPlanHead,  
  queryPoPlanBody,  
  queryPoPlanFlat,  
  addPoPlan,  
  updatePoPlan,  
  delPoPlan,  
} from "@/services/materials/PoPlan";

/**
 * 定义state类型
 */
export interface IPoPlanHeadStateType {}

/**
 * 定义Model数据类型
 */
export interface IPoPlanHeadModelType {
  namespace: string;
  state: IPoPlanHeadStateType;
  effects: {
    queryPoPlanHead: Effect;
    queryPoPlanBody: Effect;
    queryPoPlanFlat: Effect;
    addPoPlan: Effect;
    updatePoPlan: Effect;
    delPoPlan: Effect;
  };

  reducers: {};
}

/**
 * 采购计划
 */
const PoPlanHeadModel: IPoPlanHeadModelType = {
  namespace: "poPlan",

  state: {},

  effects: {
    *queryPoPlanHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPoPlanHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPoPlanBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPoPlanBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPoPlanFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPoPlanFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPoPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPoPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePoPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePoPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *delPoPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delPoPlan, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PoPlanHeadModel;
