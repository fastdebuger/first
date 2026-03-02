import type { Effect } from 'umi';
import type { ResponseGenerator } from '@/typings';
import {
  getPartsledger,
  addPartsledger,
  deletePartsledger,
  updatePartsledger,
  importSub,
  deleteAllledger,
  importJSONFormatPartLedger,
  getPartsFieldMap,
  addPartsFieldMap,
  updatePartsFieldMap,
  deletePartsFieldMap,
} from '@/services/base/part';

/**
 * 定义state类型
 */
export type IBasePartStateType = Record<string, never>;
export type PartReducers = Record<string, never>;

/**
 * 定义Model数据类型
 */
export interface IBasePartModelType {
  namespace: string;
  state: IBasePartStateType;
  effects: {
    getPartsledger: Effect;
    addPartsledger: Effect;
    deletePartsledger: Effect;
    updatePartsledger: Effect;
    importSub: Effect;
    deleteAllledger: Effect;
    importJSONFormatPartLedger: Effect;
    getPartsFieldMap: Effect;
    addPartsFieldMap: Effect;
    updatePartsFieldMap: Effect;
    deletePartsFieldMap: Effect;
  };
  reducers: PartReducers;
}

/**
 * 甲供需求计划单
 */
const BasePartModel: IBasePartModelType = {
  namespace: 'part',

  state: {},

  effects: {
    *getPartsledger({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(getPartsledger, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addPartsledger({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(addPartsledger, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePartsledger({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(deletePartsledger, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePartsledger({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updatePartsledger, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteAllledger({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(deleteAllledger, payload);
      if (callback) {
        callback(response);
      }
    },
    *importSub({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(importSub, payload);
      if (callback) {
        callback(response);
      }
    },
    *importJSONFormatPartLedger({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(importJSONFormatPartLedger, payload);
      if (callback) {
        callback(response);
      }
    },
    *getPartsFieldMap({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(getPartsFieldMap, payload);
      if (callback) {
        callback(response);
      }
    },
    *addPartsFieldMap({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(addPartsFieldMap, payload);
      if (callback) {
        callback(response);
      }
    },
    *updatePartsFieldMap({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updatePartsFieldMap, payload);
      if (callback) {
        callback(response);
      }
    },
    *deletePartsFieldMap({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(deletePartsFieldMap, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {},
};

export default BasePartModel;
