import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getWarehouseInfo,  
  addWarehouseInfo,  
  updateWarehouseInfo,  
  deleteWarehouseInfo,  
} from "@/services/base/warehouseInfo";

/**
 * 定义state类型
 */
export interface IWarehouseInfoStateType {}

/**
 * 定义Model数据类型
 */
export interface IWarehouseInfoModelType {
  namespace: string;
  state: IWarehouseInfoStateType;
  effects: {
    getWarehouseInfo: Effect;
    addWarehouseInfo: Effect;
    updateWarehouseInfo: Effect;
    deleteWarehouseInfo: Effect;
  };

  reducers: {};
}

/**
 * 仓库信息
 */
const WarehouseInfoModel: IWarehouseInfoModelType = {
  namespace: "warehouseInfo",

  state: {},

  effects: {
    *getWarehouseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWarehouseInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWarehouseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWarehouseInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWarehouseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWarehouseInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteWarehouseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteWarehouseInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default WarehouseInfoModel;
