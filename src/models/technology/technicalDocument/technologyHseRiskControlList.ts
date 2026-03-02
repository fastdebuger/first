import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getTechnologyHseRiskControlList,
  addTechnologyHseRiskControlList,
  updateTechnologyHseRiskControlList,
  deleteTechnologyHseRiskControlList,
  importTechnologyHseRiskControlList,
} from "@/services/technology/technicalDocument/technologyHseRiskControlList";

/**
 * 定义state类型
 */
export interface ITechnologyHseRiskControlListStateType {}

/**
 * 定义Model数据类型
 */
export interface ITechnologyHseRiskControlListModelType {
  namespace: string;
  state: ITechnologyHseRiskControlListStateType;
  effects: {
    getTechnologyHseRiskControlList: Effect;
    addTechnologyHseRiskControlList: Effect;
    updateTechnologyHseRiskControlList: Effect;
    deleteTechnologyHseRiskControlList: Effect;
    importTechnologyHseRiskControlList: Effect;
  };

  reducers: {};
}

/**
 * HSE重大风险清单
 */
const TechnologyHseRiskControlListModel: ITechnologyHseRiskControlListModelType = {
  namespace: "technologyHseRiskControlList",

  state: {},

  effects: {
    *getTechnologyHseRiskControlList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getTechnologyHseRiskControlList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addTechnologyHseRiskControlList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addTechnologyHseRiskControlList, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateTechnologyHseRiskControlList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateTechnologyHseRiskControlList, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteTechnologyHseRiskControlList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteTechnologyHseRiskControlList, payload);
      if (callback) {
        callback(response);
      }
    },
    *importTechnologyHseRiskControlList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importTechnologyHseRiskControlList, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default TechnologyHseRiskControlListModel;
