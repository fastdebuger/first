import { Effect } from "umi";
import { Reducer } from "@@/plugin-dva/connect";

import {
  addMaterialInnerUser,
  deleteMaterialInnerUser,
  getMaterialInnerUser,
  updateMaterialInnerUser,
} from '@/services/base/inneruser';
/**
 * 定义state类型
 */
export interface IMaterialInnerUserStateType {
  materialInnerUserList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMaterialInnerUserModelType {
  namespace: string;
  state: IMaterialInnerUserStateType;
  effects: {
    getMaterialInnerUser: Effect;

    addMaterialInnerUser: Effect;

    updateMaterialInnerUser: Effect;

    deleteMaterialInnerUser: Effect;
  };

  reducers: {
    saveMaterialInnerUserList: Reducer<IMaterialInnerUserStateType>;
  };
}

/**
 * 供应人员
 */
const MaterialInnerUserModel: IMaterialInnerUserModelType = {
  namespace: "materialinneruser",

  state: {
    materialInnerUserList: [],
  },

  effects: {
    * getMaterialInnerUser({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialInnerUser, payload);
      if (callback) {
        callback(response);
      }

      yield put({
        type: 'saveMaterialInnerUserList',
        payload: response.rows || [],
      });

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *addMaterialInnerUser({ payload, callback }, { call }) {
      const response = yield call(addMaterialInnerUser, payload);
      if (callback) {
        callback(response);
      }
    },

    *updateMaterialInnerUser({ payload, callback }, { call }) {
      const response = yield call(updateMaterialInnerUser, payload);
      if (callback) {
        callback(response);
      }
    },

    *deleteMaterialInnerUser({ payload, callback }, { call }) {
      const response = yield call(deleteMaterialInnerUser, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMaterialInnerUserList(state, action) {
      return {
        ...state,
        materialInnerUserList: action.payload,
      };
    },
  },
};

export default MaterialInnerUserModel;
