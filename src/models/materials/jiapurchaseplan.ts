import { Effect } from "umi";
import { Reducer } from "@@/plugin-dva/connect";

import {
  queryPurchasePlanHead,
  queryPurchasePlanBody,
  queryPurchasePlanFlat,
  addPurchasePlan,
  updatePurchasePlan,
  delPurchasePlan,
  initProcessInstance,
  importPurchasePlan,
  queryPurchasePlanVersionHead,
  queryPurchasePlanVersionBody,
  comparePurchasePlanVersionData,
  importPurchasePlanByInteraction,
  modifyImportPurchasePlanVal,
  queryPipeVersionCodeLst,
  queryPurchasePlanHistory,
  queryPurchasePlanPipeLst,
  batchDelPurchasePlan
} from "@/services/materials/jiapurchaseplan";

/**
 * 定义state类型
 */
export interface IJiaPurchasePlanStateType {}

/**
 * 定义Model数据类型
 */
export interface IJiaPurchasePlanModelType {
  namespace: string;
  state: IJiaPurchasePlanStateType;
  effects: {
    queryPurchasePlanHead: Effect;
    queryPipeVersionCodeLst: Effect;
    queryPurchasePlanBody: Effect;
    queryPurchasePlanHistory: Effect;
    queryPurchasePlanPipeLst: Effect;
    queryPurchasePlanFlat: Effect;

    addPurchasePlan: Effect;

    updatePurchasePlan: Effect;

    delPurchasePlan: Effect;
    importPurchasePlanByInteraction: Effect;
    modifyImportPurchasePlanVal: Effect;
    initProcessInstance: Effect;
    queryPurchasePlanVersionHead: Effect;
    queryPurchasePlanVersionBody: Effect;
    comparePurchasePlanVersionData: Effect;
    import: Effect;
    batchDelPurchasePlan: Effect;
  };

  reducers: {
    saveList: Reducer<IJiaPurchasePlanStateType>;
  };
}

/**
 * 甲供需求计划单
 */
const JiaPurchasePlanModel: IJiaPurchasePlanModelType = {
  namespace: "jiapurchaseplan",

  state: {},

  effects: {
    *queryPurchasePlanPipeLst({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasePlanPipeLst, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPurchasePlanHistory({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasePlanHistory, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPipeVersionCodeLst({ payload, callback }, { call, put }) {
      const response = yield call(queryPipeVersionCodeLst, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPurchasePlanVersionHead({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasePlanVersionHead, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPurchasePlanVersionBody({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasePlanVersionBody, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *comparePurchasePlanVersionData({ payload, callback }, { call, put }) {
      const response = yield call(comparePurchasePlanVersionData, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryPurchasePlanHead({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasePlanHead, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *queryPurchasePlanBody({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasePlanBody, payload);
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *queryPurchasePlanFlat({ payload, callback }, { call, put }) {
      const response = yield call(queryPurchasePlanFlat, payload);
      if (response.rows && response.rows.length > 0) {
        response.rows.forEach((row: any) => {
          Object.assign(row, {
            purchase_plan_form_no: row.form_no,
            purchase_plan_form_no_show: row.form_no_show,
          })
        })
      }
      if (callback) {
        callback(response);
      }

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *addPurchasePlan({ payload, callback }, { call }) {
      const response = yield call(addPurchasePlan, payload);
      if (callback) {
        callback(response);
      }
    },

    *updatePurchasePlan({ payload, callback }, { call }) {
      const response = yield call(updatePurchasePlan, payload);
      if (callback) {
        callback(response);
      }
    },

    *delPurchasePlan({ payload, callback }, { call }) {
      const response = yield call(delPurchasePlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *batchDelPurchasePlan({ payload, callback }, { call }) {
      const response = yield call(batchDelPurchasePlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *importPurchasePlanByInteraction({ payload, callback }, { call }) {
      const response = yield call(importPurchasePlanByInteraction, payload);
      if (callback) {
        callback(response);
      }
    },
    *modifyImportPurchasePlanVal({ payload, callback }, { call }) {
      const response = yield call(modifyImportPurchasePlanVal, payload);
      if (callback) {
        callback(response);
      }
    },
    *initProcessInstance({ payload, callback }, { call }) {
      const response = yield call(initProcessInstance, payload);
      if (callback) {
        callback(response);
      }
    },
    * import({payload, callback}, {call}) {
      const response = yield call(importPurchasePlan, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default JiaPurchasePlanModel;
