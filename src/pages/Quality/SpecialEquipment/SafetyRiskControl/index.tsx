import React from 'react';
import SafetyRiskControl from './SafetyRiskControlPage';
import { connect } from 'umi';
import { getSpecialEquipmentTitle } from '../utils/util';

/**
 * 特种设备质量安全风险管控清单
 * 1.压力容器制造(组焊、安装改造修理)
 * 2.压力管道
 * 3.锅炉
 * 4.起重机械
 * 5.压力管道元件
 * @constructor
 */
const SafetyRiskControlTabs: React.FC<any> = (props) => {
  const { route: { name, marking } } = props;
  const title = getSpecialEquipmentTitle(marking) + name
  return (
    <SafetyRiskControl
      title={title}
      special_equip_type={marking}
      {...props}
    />
  )
};

export default connect()(SafetyRiskControlTabs);