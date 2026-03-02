import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getQualityProducedProducts,
  addQualityProducedProducts,
  updateQualityProducedProducts,
  deleteQualityProducedProducts,
} from "@/services/quality/qualityReport/overallQualityProducts/qualityProducedProducts";

/**
 * 定义state类型
 */
export interface IQualityProducedProductsStateType {}

/**
 * 定义Model数据类型
 */
export interface IQualityProducedProductsModelType {
  namespace: string;
  state: IQualityProducedProductsStateType;
  effects: {
    getQualityProducedProducts: Effect;
    addQualityProducedProducts: Effect;
    updateQualityProducedProducts: Effect;
    deleteQualityProducedProducts: Effect;
  };

  reducers: {};
}

/**
 * 自产产品制造质量情况
 */
const QualityProducedProductsModel: IQualityProducedProductsModelType = {
  namespace: "qualityProducedProducts",

  state: {},

  effects: {
    *getQualityProducedProducts({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getQualityProducedProducts, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addQualityProducedProducts({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addQualityProducedProducts, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateQualityProducedProducts({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateQualityProducedProducts, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteQualityProducedProducts({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteQualityProducedProducts, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default QualityProducedProductsModel;
