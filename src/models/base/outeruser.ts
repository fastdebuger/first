import { Effect } from 'umi';
import { Reducer } from '@@/plugin-dva/connect';
import {
  addMaterialOuterUser, deleteMaterialOuterUser,
  getMaterialOuterUser,
  updateMaterialOuterUser,
} from '@/services/base/outeruser';

/**
 * 定义state类型
 */
export interface IMaterialOuterUserStateType {
  materialOuterUserList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMaterialOuterUserModelType {
  namespace: string;
  state: IMaterialOuterUserStateType;
  effects: {
    getMaterialOuterUser: Effect;

    addMaterialOuterUser: Effect;

    updateMaterialOuterUser: Effect;

    deleteMaterialOuterUser: Effect;
  };

  reducers: {
    saveMaterialOuterUserList: Reducer<IMaterialOuterUserStateType>;
  };
}

/**
 * 领料人员信息
 */
const MaterialOuterUserModel: IMaterialOuterUserModelType = {
  namespace: 'materialouteruser',

  state: {
    materialOuterUserList: [],
  },

  effects: {
    * getMaterialOuterUser({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialOuterUser, payload);
      if (callback) {
        callback(response);
      }

      yield put({
        type: 'saveMaterialOuterUserList',
        payload: response.rows || [],
      });

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    * addMaterialOuterUser({ payload, callback }, { call }) {
      const response = yield call(addMaterialOuterUser, payload);
      if (callback) {
        callback(response);
      }
    },

    * updateMaterialOuterUser({ payload, callback }, { call }) {
      const response = yield call(updateMaterialOuterUser, payload);
      if (callback) {
        callback(response);
      }
    },

    * deleteMaterialOuterUser({ payload, callback }, { call }) {
      const response = yield call(deleteMaterialOuterUser, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMaterialOuterUserList(state, action) {
      return {
        ...state,
        materialOuterUserList: action.payload,
      };
    },
  },
};

export default MaterialOuterUserModel;
