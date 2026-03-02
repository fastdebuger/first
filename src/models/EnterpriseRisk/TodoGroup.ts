import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getInfo,
  saveInfo,
  updateInfo,
  delInfo,
} from "@/services/EnterpriseRisk/TodoGroup";

/**
 * 定义state类型
 */
export interface ITodoGroupStateType { }

/**
 * 定义Model数据类型
 */
export interface ITodoGroupModelType {
  namespace: string;
  state: ITodoGroupStateType;
  effects: {
    getInfo: Effect;
    saveInfo: Effect;
    updateInfo: Effect;
    delInfo: Effect;
  };

  reducers: {};
}

/**
 * 用户分组
 */
const TodoGroupModel: ITodoGroupModelType = {
  namespace: "todoGroup",

  state: {},

  effects: {
    *getInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInfo, payload);
      response.rows = response?.result?.map((item: any) => {
        try {
          const push_group_code = JSON.parse(item.push_group);
          return ({
            ...item,
            push_group_code
          })
        } catch (error) {
          return ({
            ...item,
            push_group_code: []
          })
        }
      });
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *saveInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(saveInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *delInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default TodoGroupModel;
