import React, { useEffect } from 'react';
import { Modal, Avatar, Popover, Badge, Divider, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import { history } from 'umi';
import AvatarComponent from './AvatarDropdown';
// @ts-ignore
import styles from './index.less';
import { connect, SelectLang } from 'umi';
import {getUnreadCount} from "@/services/common/list";

const GlobalHeaderRight: React.FC<any> = (props) => {
  const { dispatch } = props;
  const userCode = localStorage.getItem('auth-default-userCode');
  const [msgCount, setMsgCount] = React.useState(0);

  const fetchList = async () => {
    const res = await getUnreadCount({
      user_code: userCode,
    })
    if (res && res.result) {
      setMsgCount(res.result.unread_count || 0);
    }
  }

  useEffect(() => {
    fetchList()
  }, []);

  /**
   * 退出登录
   */
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      okText: '退出',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        if (props && props.dispatch) {
          props.dispatch({ type: 'login/logout' });
        }
      },
    });
  };

  /**
   * 跳转到个人中心
   */
  const handleGoToUserCenter = () => {
    history.push('/userInfo');
  };

  const menuContent = (
    <Menu>
      <Menu.Item onClick={handleGoToUserCenter} icon={<UserOutlined className={styles.menuIcon}/>}>
        个人中心
      </Menu.Item>
      <Menu.Item onClick={handleLogout} icon={<LogoutOutlined className={styles.menuIcon}/>}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`${styles.right} ${styles.dark}`}>
      <AvatarComponent />
      <div className={`${styles.action} ${styles.avatarAction}`}>
        <Badge count={msgCount}>
          <BellOutlined onClick={() => {
            dispatch({
              type: 'common/showMessageModal',
              payload: {
                isShow: true
              }
            })
          }} style={{fontSize: 20}} />
        </Badge>
      </div>
      <SelectLang className={styles.action} />
      <Dropdown overlay={menuContent}>
        <div className={`${styles.action} ${styles.avatarAction}`}>
          <Avatar size={32} icon={<UserOutlined />} />
        </div>
      </Dropdown>
    </div>
  );
};

export default connect()(GlobalHeaderRight);
