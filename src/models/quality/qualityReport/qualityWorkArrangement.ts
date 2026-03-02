import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityManagementPlan,
  addQualityManagementPlan,
  updateQualityManagementPlan,
  deleteQualityManagementPlan,
} from "@/services/quality/qualityReport/qualityWorkArrangement";

/**
 * 定义state类型
 */
export interface IQualityWorkArrangementStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityWorkArrangementModelType {
  namespace: string;
  state: IQualityWorkArrangementStateType;
  effects: {
    getQualityManagementPlan: Effect;
    addQualityManagementPlan: Effect;
    updateQualityManagementPlan: Effect;
    deleteQualityManagementPlan: Effect;
  };

  reducers: {};
}

/**
 * 工作安排及建议
 */
const QualityWorkArrangementModel: IQualityWorkArrangementModelType = {
  namespace: "qualityWorkArrangement",

  state: {},

  effects: {
    *getQualityManagementPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityManagementPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityManagementPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityManagementPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityManagementPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityManagementPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityManagementPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityManagementPlan, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityWorkArrangementModel;
