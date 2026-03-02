import {Effect} from 'umi';
import {Reducer} from '@@/plugin-dva/connect';
import {
  getOwnerInventory,
  addOwnerInventory,
  updateOwnerInventory,
  deleteOwnerInventory,
  batchDeleteOwnerInventory,
  importOwnerInventory
} from '@/services/base/ownerInventory';

/**
 * 定义state类型
 */
export interface IOwnerInventoryStateType {
  ownerInventoryList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IOwnerInventoryModelType {
  namespace: string;
  state: IOwnerInventoryStateType;
  effects: {
    getOwnerInventory: Effect;
    addOwnerInventory: Effect;
    updateOwnerInventory: Effect;
    deleteOwnerInventory: Effect;
    batchDeleteOwnerInventory: Effect;
    importOwnerInventory: Effect;
  };

  reducers: {
    saveOwnerInventoryList: Reducer<IOwnerInventoryStateType>;
  };
}

/**
 * 领料人员信息
 */
const OwnerInventoryModel: IOwnerInventoryModelType = {
  namespace: 'ownerInventory',

  state: {
    ownerInventoryList: [],
  },

  effects: {
    * getOwnerInventory({payload, callback}, {call, put}) {
      const response = yield call(getOwnerInventory, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'saveOwnerInventoryList',
        payload: response.rows || [],
      });
      return new Promise((resolve) => {
        resolve(response);
      });
    },

    * addOwnerInventory({payload, callback}, {call}) {
      const response = yield call(addOwnerInventory, payload);
      if (callback) {
        callback(response);
      }
    },

    * updateOwnerInventory({payload, callback}, {call}) {
      const response = yield call(updateOwnerInventory, payload);
      if (callback) {
        callback(response);
      }
    },

    * deleteOwnerInventory({payload, callback}, {call}) {
      const response = yield call(deleteOwnerInventory, payload);
      if (callback) {
        callback(response);
      }
    },
    * batchDeleteOwnerInventory({payload, callback}, {call}) {
      const response = yield call(batchDeleteOwnerInventory, payload);
      if (callback) {
        callback(response);
      }
    },
    * importOwnerInventory({payload, callback}, {call}) {
      const response = yield call(importOwnerInventory, payload);
      if (callback) {
        callback(response);
      }
    },

  },
  reducers: {
    saveOwnerInventoryList(state, action) {
      return {
        ...state,
        materialOuterUserList: action.payload,
      };
    },
  },
};

export default OwnerInventoryModel;
