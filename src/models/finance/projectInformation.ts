import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryProjectInformation,
  addProjectInformation,
  delProjectInformation,
  updateProjectInformation,
  importProjectInformation, queryProjectInformationStatistic,
} from "@/services/finance/projectInformation";

/**
 * 定义state类型
 */
export interface IProjectInformationStateType {}

/**
 * 定义Model数据类型
 */
export interface IProjectInformationModelType {
  namespace: string;
  state: IProjectInformationStateType;
  effects: {
    queryProjectInformation: Effect;
    addProjectInformation: Effect;
    delProjectInformation: Effect;
    updateProjectInformation: Effect;
    importProjectInformation: Effect;
  };

  reducers: {};
}

/**
 * 项目信息
 */
const ProjectInformationModel: IProjectInformationModelType = {
  namespace: "projectInformation",

  state: {},

  effects: {
    *queryProjectInformation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryProjectInformation, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryProjectInformationStatistic({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryProjectInformationStatistic, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addProjectInformation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addProjectInformation, payload);
      if (callback) {
        callback(response);
      }
    },
    *delProjectInformation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delProjectInformation, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateProjectInformation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateProjectInformation, payload);
      if (callback) {
        callback(response);
      }
    },
    *importProjectInformation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importProjectInformation, payload);
      if (callback) {
        callback(response);
      }
    }
  },
  reducers: {},
};

export default ProjectInformationModel;
