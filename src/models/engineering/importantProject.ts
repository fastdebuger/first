import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getKeyProjectList,
  addKeyProjectList,
  updateKeyProjectList,
  deleteKeyProjectList,
  getKeyProjectStatistic,
} from "@/services/engineering/importantProject";

/**
 * 定义state类型
 */
export interface IKeyProjectListStateType {}

/**
 * 定义Model数据类型
 */
export interface IKeyProjectListModelType {
  namespace: string;
  state: IKeyProjectListStateType;
  effects: {
    getKeyProjectList: Effect;
    getKeyProjectStatistic: Effect;
    addKeyProjectList: Effect;
    updateKeyProjectList: Effect;
    deleteKeyProjectList: Effect;
  };

  reducers: {};
}

/**
 * 重点项目台账
 */
const KeyProjectListModel: IKeyProjectListModelType = {
  namespace: "importantProject",

  state: {},

  effects: {
    *getKeyProjectStatistic({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getKeyProjectStatistic, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getKeyProjectList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getKeyProjectList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addKeyProjectList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addKeyProjectList, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateKeyProjectList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateKeyProjectList, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteKeyProjectList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteKeyProjectList, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default KeyProjectListModel;
