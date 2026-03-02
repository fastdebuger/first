import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualitySystemOperation,
  addQualitySystemOperation,
  updateQualitySystemOperation,
  deleteQualitySystemOperation,
} from "@/services/quality/qualityReport/qualitySystemOperation";

/**
 * 定义state类型
 */
export interface IQualitySystemOperationStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualitySystemOperationModelType {
  namespace: string;
  state: IQualitySystemOperationStateType;
  effects: {
    getQualitySystemOperation: Effect;
    addQualitySystemOperation: Effect;
    updateQualitySystemOperation: Effect;
    deleteQualitySystemOperation: Effect;
  };

  reducers: {};
}

/**
 * 质量体系运行情况
 */
const QualitySystemOperationModel: IQualitySystemOperationModelType = {
  namespace: "qualitySystemOperation",

  state: {},

  effects: {
    *getQualitySystemOperation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualitySystemOperation, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualitySystemOperation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualitySystemOperation, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualitySystemOperation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualitySystemOperation, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualitySystemOperation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualitySystemOperation, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualitySystemOperationModel;
