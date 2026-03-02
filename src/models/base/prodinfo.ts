import {Effect} from "umi";
import {Reducer} from "@@/plugin-dva/connect";
import {
  addMatreialProdInfo,
  deleteMatreialProdInfo,
  getMatreialProdInfo,
  updateMatreialProdInfo,
  importMatreialProdInfo,
  batchDeleteMaterialProdInfo,
  queryRefuseOutStorageLst,
  batchAddRefuseOutStorageLst,
  batchDelRefuseOutStorageLst,
  importCheckMaterialProdInfo
} from '@/services/base/prodinfo';

/**
 * 定义state类型
 */
export interface IMatreialProdInfoStateType {
  matreialProdInfoList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMatreialProdInfoModelType {
  namespace: string;
  state: IMatreialProdInfoStateType;
  effects: {
    getMatreialProdInfo: Effect;

    addMatreialProdInfo: Effect;

    updateMatreialProdInfo: Effect;
    batchDeleteMaterialProdInfo: Effect;
    deleteMatreialProdInfo: Effect;
    import: Effect;
    queryRefuseOutStorageLst: Effect;
    batchAddRefuseOutStorageLst: Effect;
    batchDelRefuseOutStorageLst: Effect;
    importCheckMaterialProdInfo: Effect;
  };

  reducers: {
    saveMatreialProdInfoList: Reducer<IMatreialProdInfoStateType>;
  };
}

/**
 * 物料信息
 */
const MatreialProdInfoModel: IMatreialProdInfoModelType = {
  namespace: "matreialprodinfo",

  state: {
    matreialProdInfoList: [],
  },

  effects: {
    * getMatreialProdInfo({payload, callback}, {call, put}) {
      const response = yield call(getMatreialProdInfo, payload);
      if (callback) {
        callback(response);
      }

      yield put({
        type: "saveMatreialProdInfoList",
        payload: response.rows || [],
      });

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    * addMatreialProdInfo({payload, callback}, {call}) {
      const response = yield call(addMatreialProdInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    * importCheckMaterialProdInfo({payload, callback}, {call}) {
      const response = yield call(importCheckMaterialProdInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * updateMatreialProdInfo({payload, callback}, {call}) {
      const response = yield call(updateMatreialProdInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * deleteMatreialProdInfo({payload, callback}, {call}) {
      const response = yield call(deleteMatreialProdInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    * import({payload, callback}, {call}) {
      const response = yield call(importMatreialProdInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    * batchDeleteMaterialProdInfo({payload, callback}, {call}) {
      const response = yield call(batchDeleteMaterialProdInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *queryRefuseOutStorageLst({payload, callback}, {call, put}) {
      const response = yield call(queryRefuseOutStorageLst, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *batchAddRefuseOutStorageLst({payload, callback}, {call}) {
      const response = yield call(batchAddRefuseOutStorageLst, payload);
      if (callback) {
        callback(response);
      }
    },
    *batchDelRefuseOutStorageLst({payload, callback}, {call}) {
      const response = yield call(batchDelRefuseOutStorageLst, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMatreialProdInfoList(state, action) {
      return {
        ...state,
        matreialProdInfoList: action.payload,
      };
    },
  },
};

export default MatreialProdInfoModel;
