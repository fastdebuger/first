import { Effect } from "umi";
import { ResponseGenerator } from "@/typings";
// import { Reducer } from "@@/plugin-dva/connect";

import {
  getSettlementManagement,
  addSettlementManagement,
  updateSettlementManagement,
  deleteSettlementManagement,
  exportSettlementManagement
} from "@/services/costControl/settlement/mainContractSettlement";

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
    getSettlementManagement: Effect;
    addSettlementManagement: Effect;
    updateSettlementManagement: Effect;
    deleteSettlementManagement: Effect;
    exportSettlementManagement: Effect;
  };

  reducers: {};
}

/**
 * 主合同结算管理
 */
const SettlementManagementModel: ISettlementManagementModelType = {
  namespace: "settlementManagement",

  state: {},

  effects: {
    *getSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
    *exportSettlementManagement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(exportSettlementManagement, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default SettlementManagementModel;
