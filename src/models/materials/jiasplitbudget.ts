import { Effect } from "umi";

import {
  querySplitBudgetHead,
  querySplitBudgetBody,
  querySplitBudgetFlat,
  addSplitBudget,
  updateSplitBudget,
  delSplitBudget,
  initProcessInstance,
  queryBakData,
  queryDeductionListDetail,
  importSplitBudget,
  queryPipeCodeByProdCode,
  querySplitBudgetVersionHead,
  querySplitBudgetVersionBody,
  compareSplitBudgetVersionData,
} from "@/services/materials/jiasplitbudget";

/**
 * 定义state类型
 */
export interface IJIaSplitBudgetStateType {}

/**
 * 定义Model数据类型
 */
export interface IJIaSplitBudgetModelType {
  namespace: string;
  state: IJIaSplitBudgetStateType;
  effects: {
    querySplitBudgetHead: Effect;
    querySplitBudgetBody: Effect;
    querySplitBudgetFlat: Effect;
    addSplitBudget: Effect;
    updateSplitBudget: Effect;
    delSplitBudget: Effect;
    initProcessInstance: Effect;
    queryBakData: Effect;
    importSplitBudget: Effect;
    queryDeductionListDetail: Effect;
    queryPipeCodeByProdCode: Effect;
    querySplitBudgetVersionHead: Effect;
    querySplitBudgetVersionBody: Effect;
    compareSplitBudgetVersionData: Effect;
  };

  reducers: {};
}

/**
 * 甲供分割预算
 */
const JIaSplitBudgetModel: IJIaSplitBudgetModelType = {
  namespace: "jiasplitbudget",

  state: {},

  effects: {
    *querySplitBudgetVersionHead({ payload, callback }, { call }) {
      const response = yield call(querySplitBudgetVersionHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySplitBudgetVersionBody({ payload, callback }, { call }) {
      const response = yield call(querySplitBudgetVersionBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *compareSplitBudgetVersionData({ payload, callback }, { call }) {
      const response = yield call(compareSplitBudgetVersionData, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySplitBudgetHead({ payload, callback }, { call }) {
      const response = yield call(querySplitBudgetHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySplitBudgetBody({ payload, callback }, { call }) {
      const response = yield call(querySplitBudgetBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryDeductionListDetail({ payload, callback }, { call }) {
      const response = yield call(queryDeductionListDetail, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *querySplitBudgetFlat({ payload, callback }, { call }) {
      const response = yield call(querySplitBudgetFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    }, *queryPipeCodeByProdCode({ payload, callback }, { call }) {
      const response = yield call(queryPipeCodeByProdCode, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSplitBudget({ payload, callback }, { call }) {
      const response = yield call(addSplitBudget, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateSplitBudget({ payload, callback }, { call }) {
      const response = yield call(updateSplitBudget, payload);
      if (callback) {
        callback(response);
      }
    },
    *delSplitBudget({ payload, callback }, { call }) {
      const response = yield call(delSplitBudget, payload);
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
    *queryBakData({ payload, callback }, { call }) {
      const response = yield call(queryBakData, payload);
      if (response.rows && response.rows.length > 0) {
        response.rows.forEach((row: any) => {
          Object.assign(row, {
            total_split_num: row.split_num,
            total_plan_num: row.plan_num,
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
    *importSplitBudget({ payload, callback }, { call }) {
      const response = yield call(importSplitBudget, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default JIaSplitBudgetModel;
