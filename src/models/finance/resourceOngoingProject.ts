import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryResourceOngoingProject,
  addResourceOngoingProject,
  delResourceOngoingProject,
  updateResourceOngoingProject,
  importResourceOngoingProject,
} from "@/services/finance/resourceOngoingProject";

/**
 * 定义state类型
 */
export interface IResourceOngoingProjectStateType {}

/**
 * 定义Model数据类型
 */
export interface IResourceOngoingProjectModelType {
  namespace: string;
  state: IResourceOngoingProjectStateType;
  effects: {
    queryResourceOngoingProject: Effect;
    addResourceOngoingProject: Effect;
    delResourceOngoingProject: Effect;
    updateResourceOngoingProject: Effect;
    importResourceOngoingProject: Effect;
  };

  reducers: {};
}

/**
 * 在建项目资源结转情况
 */
const ResourceOngoingProjectModel: IResourceOngoingProjectModelType = {
  namespace: "resourceOngoingProject",

  state: {},

  effects: {
    *queryResourceOngoingProject({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryResourceOngoingProject, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addResourceOngoingProject({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addResourceOngoingProject, payload);
      if (callback) {
        callback(response);
      }
    },
    *delResourceOngoingProject({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delResourceOngoingProject, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateResourceOngoingProject({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateResourceOngoingProject, payload);
      if (callback) {
        callback(response);
      }
    },
    *importResourceOngoingProject({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importResourceOngoingProject, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default ResourceOngoingProjectModel;
