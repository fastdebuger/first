import { Effect } from 'umi';
import { Reducer } from '@@/plugin-dva/connect';
import {
  addMaterialStorageInfo,
  deleteMaterialStorageInfo,
  getMaterialStorageInfo, updateMaterialStorageInfo,
} from '@/services/base/storageinfo';

/**
 * 定义state类型
 */
export interface IMaterialStorageInfoStateType {
  materialStorageInfoList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMaterialStorageInfoModelType {
  namespace: string;
  state: IMaterialStorageInfoStateType;
  effects: {
    getMaterialStorageInfo: Effect;

    addMaterialStorageInfo: Effect;

    updateMaterialStorageInfo: Effect;

    deleteMaterialStorageInfo: Effect;
  };

  reducers: {
    saveMaterialStorageInfoList: Reducer<IMaterialStorageInfoStateType>;
  };
}

/**
 * 仓库信息
 */
const MaterialStorageInfoModel: IMaterialStorageInfoModelType = {
  namespace: 'materialstorageinfo',

  state: {
    materialStorageInfoList: [],
  },

  effects: {
    * getMaterialStorageInfo({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialStorageInfo, payload);
      if (callback) {
        callback(response);
      }

      yield put({
        type: 'saveMaterialStorageInfoList',
        payload: response.rows || [],
      });

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    * addMaterialStorageInfo({ payload, callback }, { call }) {
      const response = yield call(addMaterialStorageInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * updateMaterialStorageInfo({ payload, callback }, { call }) {
      const response = yield call(updateMaterialStorageInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * deleteMaterialStorageInfo({ payload, callback }, { call }) {
      const response = yield call(deleteMaterialStorageInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMaterialStorageInfoList(state, action) {
      return {
        ...state,
        materialStorageInfoList: action.payload,
      };
    },
  },
};

export default MaterialStorageInfoModel;
