import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";

import {
  getProjectBaseInfoList,
  addProjectBaseInfo,
  updateProjectBaseInfo,
  deleteProjectBaseInfo,
  getProjectBaseInfoDetail,
  importProjectBaseInfo,
  getAreaDictTree,
  getThreeNewCategoryDictTree,
  getTemplateDownloadUrl,
  startApproval,
} from "@/services/scheduleManagement/basicInfoManage/projectBasicInfo";

/**
 * 定义state类型
 */
export interface IPurchaseStateType { }

/**
 * 定义Model数据类型
 */
export interface IPurchaseModelType {
  namespace: string;
  state: IPurchaseStateType;
  effects: {
    getProjectBaseInfoList: Effect;
    addProjectBaseInfo: Effect;
    updateProjectBaseInfo: Effect;
    deleteProjectBaseInfo: Effect;
    getProjectBaseInfoDetail: Effect;
    importProjectBaseInfo: Effect;
    getAreaDictTree: Effect;
    getThreeNewCategoryDictTree: Effect;
    getTemplateDownloadUrl: Effect;
    startApproval: Effect;
  };

  reducers: {};
}

/**
 * 项目基本信息
 */
const BasicInfo: IPurchaseModelType = {
  namespace: "basicInfo",

  state: {},

  effects: {
    *getProjectBaseInfoList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProjectBaseInfoList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addProjectBaseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addProjectBaseInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateProjectBaseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateProjectBaseInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteProjectBaseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteProjectBaseInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getProjectBaseInfoDetail({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProjectBaseInfoDetail, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *importProjectBaseInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importProjectBaseInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getAreaDictTree({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getAreaDictTree, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getThreeNewCategoryDictTree({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getThreeNewCategoryDictTree, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getTemplateDownloadUrl({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getTemplateDownloadUrl, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *startApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    
    
    
    
  },
  reducers: {},
};

export default BasicInfo;
