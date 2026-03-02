import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getSubSettlementManagement,
  addSubSettlementManagement,
  updateSubSettlementManagement,
  deleteSubSettlementManagement,
  exportSubSettlementManagement,
  addSubSettlementManagementOcr
} from "@/services/costControl/settlement/subcontractorSettlement";

/**
 * 定义state类型
 */
export interface ISettlementManagementStateType { }

/**
 * 定义Model数据类型
 */
export interface ISettlementManagementModelType {
  namespace: string;
  state: ISettlementManagementStateType;
  effects: {
    getSubSettlementManagement: Effect;
    addSubSettlementManagement: Effect;
    updateSubSettlementManagement: Effect;
    deleteSubSettlementManagement: Effect;
    exportSubSettlementManagement: Effect;
    addSubSettlementManagementOcr: Effect;
  };

  reducers: {};
}

/**
 * 主合同结算管理
 */
const SettlementManagementModel: ISettlementManagementModelType = {
  namespace: "subcontractorSettlement",

  state: {},

  effects: {
    *getSubSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSubSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSubSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSubSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSubSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSubSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteSubSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSubSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
    *exportSubSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(exportSubSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
    *addSubSettlementManagementOcr({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSubSettlementManagementOcr, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default SettlementManagementModel;
