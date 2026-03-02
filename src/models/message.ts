import type { Reducer, Effect } from 'umi';
import {
  queryMessageList,
  queryListBySender,
  sendAnnouncement,
} from '@/services/common/list';

import type { ResponseGenerator } from '@/typings';
/**
 * 定义state类型
 */
export interface MessageStateType {
  list?: any;
}

/**
 * 定义Modal数据类型
 */
export interface MessageModalType {
  namespace: string;
  state: MessageStateType;
  effects: {
    queryMessageList: Effect;
    queryListBySender: Effect;
    sendAnnouncement: Effect;
  };
  reducers: {
    saveList: Reducer<MessageStateType>;
  };
}

const MessageModel: MessageModalType = {
  namespace: 'message',

  state: {
    list: {
      rows: [],
    },
  },

  effects: {
    *queryListBySender({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryListBySender, payload);
      yield put({
        type: 'saveList',
        payload: response.rows,
      });
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryMessageList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryMessageList, payload);
      yield put({
        type: 'saveList',
        payload: response.rows,
      });
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *sendAnnouncement({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(sendAnnouncement, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload || [],
      };
    },
  },
};

export default MessageModel;
