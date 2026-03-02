import React from 'react';
import DispatchMeetingPage from './DispatchMeetingPage';
import { getSpecialEquipmentTitle } from '../utils/util';

/**
 * 特种设备每月质量安全调度会议纪要
 * 1.压力容器制造(组焊、安装改造修理)
 * 2.压力管道
 * 3.锅炉
 * 4.起重机械
 * 5.压力管道元件
 * @constructor
 */
const DispatchMeetingPageTabs: React.FC<any> = (props) => {
  const { route: { name, marking } } = props;
  const title = getSpecialEquipmentTitle(marking) + name
  return (
    <DispatchMeetingPage
      title={title}
      special_equip_type={marking}
      {...props}
    />
  )
};

export default DispatchMeetingPageTabs;