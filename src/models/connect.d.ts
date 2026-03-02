import type { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import type { StateType } from './login';
import type { CommonStateType } from '@/models/common';
import type { ISteelMemberCategoryStateType } from '@/models/base/steelmembercategory';
import type { IPositionStateType } from '@/models/engineering/workLicenseRegister';

export { GlobalModelState, UserModelState };

export type Loading = {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
};

export type ConnectState = {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  login: StateType;
  common: CommonStateType;
  steelmembercategory: ISteelMemberCategoryStateType;
  workLicenseRegister: IPositionStateType;
};

export type Route = {
  routes?: Route[];
} & MenuDataItem;
