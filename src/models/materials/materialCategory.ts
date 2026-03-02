import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getMaterialCategory,
  addMaterialCategory,
  updateMaterialCategory,
  deleteMaterialCategory,
} from "@/services/materials/materialCategory";

/**
 * 定义state类型
 */
export interface IMaterialCategoryStateType {}

/**
 * 定义Model数据类型
 */
export interface IMaterialCategoryModelType {
  namespace: string;
  state: IMaterialCategoryStateType;
  effects: {
    getMaterialCategory: Effect;
    addMaterialCategory: Effect;
    updateMaterialCategory: Effect;
    deleteMaterialCategory: Effect;
  };

  reducers: {};
}

/**
 * 物资类别
 */
const MaterialCategoryModel: IMaterialCategoryModelType = {
  namespace: "materialCategory",

  state: {},

  effects: {
    *getMaterialCategory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMaterialCategory, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMaterialCategory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMaterialCategory, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateMaterialCategory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMaterialCategory, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteMaterialCategory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteMaterialCategory, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default MaterialCategoryModel;
