import type { Effect } from 'umi';
import { upLoad, delFile, mkDir } from '@/services/upload';
import type { ResponseGenerator } from '@/typings';

/**
 * 定义Modal数据类型
 */

export type IBasePartStateType = Record<string, never>;
export type PartReducers = Record<string, never>;
export interface BaseUploadFileModalType {
  namespace: string;
  state: IBasePartStateType;
  effects: {
    upLoad: Effect;
    delFile: Effect;
    mkDir: Effect;
    upLoadPro: Effect;
  };
  reducers: PartReducers;
}

const BaseUploadFile: BaseUploadFileModalType = {
  namespace: 'fileUpload',

  state: {},

  effects: {
    *upLoad({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(upLoad, payload);
      if (callback) callback(response);
    },
    *upLoadPro({ payload }, { call }) {
      const response: ResponseGenerator = yield call(upLoad, payload);
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delFile({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(delFile, payload);
      if (callback) callback(response);
    },
    *mkDir({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(mkDir, payload);
      if (callback) callback(response);
    },
  },

  reducers: {},
};

export default BaseUploadFile;
