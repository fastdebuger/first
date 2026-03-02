import {Effect} from "umi";
import {Reducer} from "@@/plugin-dva/connect";
import {
  getMaterialProdSubstituteInfo,
  addMaterialProdSubstituteInfo,
  updateMaterialProdSubstituteInfo,
  deleteMaterialProdSubstituteInfo,
} from '@/services/base/substitution';

/**
 * 定义state类型
 */
export interface IMatreialProdSubstitutionStateType {
  matreialProdSubstitutionList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMatreialProdSubstitutionModelType {
  namespace: string;
  state: IMatreialProdSubstitutionStateType;
  effects: {
    getMaterialProdSubstituteInfo: Effect;
    addMaterialProdSubstituteInfo: Effect;
    updateMaterialProdSubstituteInfo: Effect;
    deleteMaterialProdSubstituteInfo: Effect;
  };

  reducers: {
    saveMatreialProdSubstitutionList: Reducer<IMatreialProdSubstitutionStateType>;
  };
}

/**
 * 物料信息
 */
const MatreialProdSubstitutionModel: IMatreialProdSubstitutionModelType = {
  namespace: "matreialprodSubstitution",

  state: {
    matreialProdSubstitutionList: [],
  },

  effects: {
    * getMaterialProdSubstituteInfo({payload, callback}, {call, put}) {
      const response = yield call(getMaterialProdSubstituteInfo, payload);
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

    * addMaterialProdSubstituteInfo({payload, callback}, {call}) {
      const response = yield call(addMaterialProdSubstituteInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * updateMaterialProdSubstituteInfo({payload, callback}, {call}) {
      const response = yield call(updateMaterialProdSubstituteInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * deleteMaterialProdSubstituteInfo({payload, callback}, {call}) {
      const response = yield call(deleteMaterialProdSubstituteInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMatreialProdSubstitutionList(state, action) {
      return {
        ...state,
        matreialProdSubstitutionList: action.payload,
      };
    },
  },
};

export default MatreialProdSubstitutionModel;
