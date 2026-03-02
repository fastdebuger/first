import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryTechnologyHseRiskControlListYearHead,
  queryTechnologyHseRiskControlListYearBody,
  queryTechnologyHseRiskControlListYearFlat,
  addTechnologyHseRiskControlListYear,
  updateTechnologyHseRiskControlListYear,
  delTechnologyHseRiskControlListYea,
  importTechnologyHseRiskControlListYear,
  importTechnologyHseRiskControlListYear2,
} from "@/services/technology/technicalDocument/technologyHseRiskControlListYear";

/**
 * 定义state类型
 */
export interface ITechnologyHseRiskControlListYearStateType {}

/**
 * 定义Model数据类型
 */
export interface ITechnologyHseRiskControlListYearModelType {
  namespace: string;
  state: ITechnologyHseRiskControlListYearStateType;
  effects: {
    queryTechnologyHseRiskControlListYearHead: Effect;
    queryTechnologyHseRiskControlListYearBody: Effect;
    queryTechnologyHseRiskControlListYearFlat: Effect;
    addTechnologyHseRiskControlListYear: Effect;
    updateTechnologyHseRiskControlListYear: Effect;
    delTechnologyHseRiskControlListYea: Effect;
    importTechnologyHseRiskControlListYear: Effect;
    importTechnologyHseRiskControlListYear2: Effect;
  };

  reducers: {};
}

/**
 * 年度安全重大风险及控制措施清单
 */
const TechnologyHseRiskControlListYearModel: ITechnologyHseRiskControlListYearModelType = {
  namespace: "technologyHseRiskControlListYear",

  state: {},

  effects: {
    *queryTechnologyHseRiskControlListYearHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTechnologyHseRiskControlListYearHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryTechnologyHseRiskControlListYearBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTechnologyHseRiskControlListYearBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryTechnologyHseRiskControlListYearFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryTechnologyHseRiskControlListYearFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addTechnologyHseRiskControlListYear({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addTechnologyHseRiskControlListYear, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateTechnologyHseRiskControlListYear({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateTechnologyHseRiskControlListYear, payload);
      if (callback) {
        callback(response);
      }
    },
    *delTechnologyHseRiskControlListYea({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delTechnologyHseRiskControlListYea, payload);
      if (callback) {
        callback(response);
      }
    },
    *importTechnologyHseRiskControlListYear({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importTechnologyHseRiskControlListYear, payload);
      if (callback) {
        callback(response);
      }
    },
    *importTechnologyHseRiskControlListYear2({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importTechnologyHseRiskControlListYear2, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default TechnologyHseRiskControlListYearModel;
