import React from 'react';
import QualitySafetyWeekCheck from './QualitySafetyWeekCheckPage';
import { getSpecialEquipmentTitle } from '../utils/util';

/**
 * 特种设备每周质量安全排查治理报告
 * 1.压力容器制造(组焊、安装改造修理)
 * 2.压力管道
 * 3.锅炉
 * 4.起重机械
 * 5.压力管道元件
 * @constructor
 */
const QualitySafetyWeekCheckTabs: React.FC<any> = (props) => {
  const { route: { name, marking } } = props;
  const title = getSpecialEquipmentTitle(marking) + name
  return (
    <QualitySafetyWeekCheck
      title={title}
      special_equip_type={marking}
      {...props}
    />
  )
};

export default QualitySafetyWeekCheckTabs;