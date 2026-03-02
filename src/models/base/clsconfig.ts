import { Effect } from "umi";
import { Reducer } from "@@/plugin-dva/connect";
import {
  addMaterialClsConfig,
  deleteMaterialClsConfig,
  getMaterialClsConfig,
  updateMaterialClsConfig,
} from '@/services/base/clsconfig';

/**
 * 定义state类型
 */
export interface IMaterialClsConfigStateType {
  materialClsConfigList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMaterialClsConfigModelType {
  namespace: string;
  state: IMaterialClsConfigStateType;
  effects: {
    getMaterialClsConfig: Effect;

    addMaterialClsConfig: Effect;

    updateMaterialClsConfig: Effect;

    deleteMaterialClsConfig: Effect;
  };

  reducers: {
    saveMaterialClsConfigList: Reducer<IMaterialClsConfigStateType>;
  };
}

/**
 * 物料分类配置
 */
const MaterialClsConfigModel: IMaterialClsConfigModelType = {
  namespace: "materialclsconfig",

  state: {
    materialClsConfigList: [],
  },

  effects: {
    *getMaterialClsConfig({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialClsConfig, payload);
      if (callback) {
        callback(response);
      }

      yield put({
        type: "saveMaterialClsConfigList",
        payload: response.rows || [],
      });

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *addMaterialClsConfig({ payload, callback }, { call }) {
      const response = yield call(addMaterialClsConfig, payload);
      if (callback) {
        callback(response);
      }
    },

    *updateMaterialClsConfig({ payload, callback }, { call }) {
      const response = yield call(updateMaterialClsConfig, payload);
      if (callback) {
        callback(response);
      }
    },

    *deleteMaterialClsConfig({ payload, callback }, { call }) {
      const response = yield call(deleteMaterialClsConfig, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMaterialClsConfigList(state, action) {
      return {
        ...state,
        materialClsConfigList: action.payload,
      };
    },
  },
};

export default MaterialClsConfigModel;
