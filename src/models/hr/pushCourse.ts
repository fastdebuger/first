import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  queryPushCourseConfigList,
  addPushCourse,
  updatePushCourse,
  deletePushCourse,
  pushCourse,
  queryPushCourseList,
  queryPushCourseRecordList,
  updateCourseStudyTime,
  updateStudyStatus,
} from "@/services/hr/pushCourse";

/**
 * 定义state类型
 */
export interface IPushCourseStateType {}

/**
 * 定义Model数据类型
 */
export interface IPushCourseModelType {
  namespace: string;
  state: IPushCourseStateType;
  effects: {
    queryPushCourseConfigList: Effect;
    addPushCourse: Effect;
    updatePushCourse: Effect;
    deletePushCourse: Effect;
    pushCourse: Effect;
    queryPushCourseList: Effect;
    queryPushCourseRecordList: Effect;
    updateCourseStudyTime: Effect;
    updateStudyStatus: Effect;
  };

  reducers: {};
}

/**
 * 推送课程
 */
const PushCourseModel: IPushCourseModelType = {
  namespace: "pushCourse",

  state: {},

  effects: {
    *queryPushCourseConfigList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPushCourseConfigList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPushCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPushCourse, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePushCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePushCourse, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePushCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deletePushCourse, payload);
      if (callback) {
        callback(response);
      }
    },
    *pushCourse({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(pushCourse, payload);
      if (callback) {
        callback(response);
      }
    },
    *queryPushCourseList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPushCourseList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPushCourseRecordList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryPushCourseRecordList, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateCourseStudyTime({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateCourseStudyTime, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateStudyStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateStudyStatus, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PushCourseModel;
