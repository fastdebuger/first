import { Spin, Input } from 'antd';
import React from 'react';
import { history, connect } from 'umi'; // 导入运行时值
import type { ConnectProps } from 'umi'; // 导入类型
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import WbsDrawer from './WbsDrawer';
// @ts-ignore
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  menu?: boolean;
}

/**
 * 首页Header 右侧的头部图标展示
 */
class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  state = {
    showChangePassword: false,
    wbsName: '',
    wbsDrawerVisible: false,
  };

  onMenuClick = (event: any) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }
    // 修改密码
    if (key === 'changePassword') {
      this.setState({ showChangePassword: true });
      return;
    }
    history.push(`/account/${key}`);
  };

  // 关闭修改密码modal
  handleHideModal = () => {
    this.setState({ showChangePassword: false });
  };

  render(): React.ReactNode {
    const userName = localStorage.getItem('auth-default-wbsName');
    return userName ? (
      <>
        <div className={`${styles.action} ${styles.account}`}>
          <Input
            readOnly
            value={userName}
            onClick={() => {
              this.setState({ wbsDrawerVisible: true });
            }}
            style={{
              cursor: 'pointer',
            }}
            onFocus={(e) => e.target.blur()}
          />
        </div>
        <WbsDrawer wbsDrawerVisible={this.state.wbsDrawerVisible} onClose={() => {
          this.setState({ wbsDrawerVisible: false });
        }}/>
      </>
    ) : (
      <span className={`${styles.action}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
