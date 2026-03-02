import { Effect } from "umi";
import { Reducer } from "@@/plugin-dva/connect";
import {
  getMaterialBidConfig,
  updateMaterialBidConfig,
  addMaterialBidConfig,
  batchDeleteMaterialBidConfig
} from '@/services/base/projectmaterialcost';

/**
 * 定义state类型
 */
export interface IMatreialProdInfoStateType {

}

/**
 * 定义Model数据类型
 */
export interface IMatreialProdInfoModelType {
  namespace: string;
  state: IMatreialProdInfoStateType;
  effects: {
    getMaterialBidConfig: Effect;
    updateMaterialBidConfig: Effect;
    addMaterialBidConfig: Effect;
    batchDeleteMaterialBidConfig: Effect;
  };

  reducers: {

  };
}

/**
 * 物料信息
 */
const MatreialProdInfoModel: IMatreialProdInfoModelType = {
  namespace: "projectmaterialcost",

  state: {

  },

  effects: {
    *getMaterialBidConfig({ payload, callback }, { call }) {
      const response = yield call(getMaterialBidConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateMaterialBidConfig({ payload, callback }, { call }) {
      const response = yield call(updateMaterialBidConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *addMaterialBidConfig({ payload, callback }, { call }) {
      const response = yield call(addMaterialBidConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    *batchDeleteMaterialBidConfig({ payload, callback }, { call }) {
      const response = yield call(batchDeleteMaterialBidConfig, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {

  },
};

export default MatreialProdInfoModel;
