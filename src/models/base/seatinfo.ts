import { Effect } from "umi";
import { Reducer } from "@@/plugin-dva/connect";
import {
  addMaterialSeatInfo,
  deleteMaterialSeatInfo, getMaterialSeatInfo,
  updateMaterialSeatInfo,
} from '@/services/base/seatinfo';

/**
 * 定义state类型
 */
export interface IMaterialSeatInfoStateType {
  materialSeatInfoList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMaterialSeatInfoModelType {
  namespace: string;
  state: IMaterialSeatInfoStateType;
  effects: {
    getMaterialSeatInfo: Effect;

    addMaterialSeatInfo: Effect;

    updateMaterialSeatInfo: Effect;

    deleteMaterialSeatInfo: Effect;
  };

  reducers: {
    saveMaterialSeatInfoList: Reducer<IMaterialSeatInfoStateType>;
  };
}

/**
 * 货位信息
 */
const MaterialSeatInfoModel: IMaterialSeatInfoModelType = {
  namespace: "materialseatinfo",

  state: {
    materialSeatInfoList: [],
  },

  effects: {
    *getMaterialSeatInfo({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialSeatInfo, payload);
      if (callback) {
        callback(response);
      }

      yield put({
        type: "saveMaterialSeatInfoList",
        payload: response.rows || [],
      });

      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *addMaterialSeatInfo({ payload, callback }, { call }) {
      const response = yield call(addMaterialSeatInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    *updateMaterialSeatInfo({ payload, callback }, { call }) {
      const response = yield call(updateMaterialSeatInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    *deleteMaterialSeatInfo({ payload, callback }, { call }) {
      const response = yield call(deleteMaterialSeatInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMaterialSeatInfoList(state, action) {
      return {
        ...state,
        materialSeatInfoList: action.payload,
      };
    },
  },
};

export default MaterialSeatInfoModel;
