import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryBusinessPartner,
  addBusinessPartner,
  delBusinessPartner,
  updateBusinessPartner,
  importBusinessPartner,
} from "@/services/finance/businessPartner";

/**
 * 定义state类型
 */
export interface IBusinessPartnerStateType {}

/**
 * 定义Model数据类型
 */
export interface IBusinessPartnerModelType {
  namespace: string;
  state: IBusinessPartnerStateType;
  effects: {
    queryBusinessPartner: Effect;
    addBusinessPartner: Effect;
    delBusinessPartner: Effect;
    updateBusinessPartner: Effect;
    importBusinessPartner: Effect;
  };

  reducers: {};
}

/**
 * 往来单位
 */
const BusinessPartnerModel: IBusinessPartnerModelType = {
  namespace: "businessPartner",

  state: {},

  effects: {
    *queryBusinessPartner({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryBusinessPartner, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addBusinessPartner({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addBusinessPartner, payload);
      if (callback) {
        callback(response);
      }
    },
    *delBusinessPartner({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delBusinessPartner, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateBusinessPartner({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateBusinessPartner, payload);
      if (callback) {
        callback(response);
      }
    },
    *importBusinessPartner({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importBusinessPartner, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default BusinessPartnerModel;
