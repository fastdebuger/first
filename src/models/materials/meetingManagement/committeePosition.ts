import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getPosition,  
  addPosition,  
  updatePosition,  
  deletePosition,  
} from "@/services/materials/meetingManagement/committeePosition";

/**
 * 定义state类型
 */
export interface IPositionStateType {}

/**
 * 定义Model数据类型
 */
export interface IPositionModelType {
  namespace: string;
  state: IPositionStateType;
  effects: {
    getPosition: Effect;
    addPosition: Effect;
    updatePosition: Effect;
    deletePosition: Effect;
  };

  reducers: {};
}

/**
 * 委员会职务档案信息
 */
const PositionModel: IPositionModelType = {
  namespace: "position",

  state: {},

  effects: {
    *getPosition({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPosition, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPosition({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPosition, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePosition({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePosition, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePosition({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deletePosition, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PositionModel;
