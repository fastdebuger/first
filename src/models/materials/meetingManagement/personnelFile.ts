import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getPerson,  
  addPerson,  
  updatePerson,  
  deletePerson,  
} from "@/services/materials/meetingManagement/personnelFile";

/**
 * 定义state类型
 */
export interface IPersonStateType {}

/**
 * 定义Model数据类型
 */
export interface IPersonModelType {
  namespace: string;
  state: IPersonStateType;
  effects: {
    getPerson: Effect;
    addPerson: Effect;
    updatePerson: Effect;
    deletePerson: Effect;
  };

  reducers: {};
}

/**
 * 人员档案
 */
const PersonModel: IPersonModelType = {
  namespace: "person",

  state: {},

  effects: {
    *getPerson({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getPerson, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPerson({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addPerson, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePerson({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updatePerson, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePerson({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deletePerson, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default PersonModel;
