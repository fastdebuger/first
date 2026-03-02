import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { hasPermission } from "@/utils/authority";

import { configColumns } from "../columns";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 作业许可证登记表详情
 * @param props
 * @constructor
 */
const WorkLicenseRegisterDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'erp_code', // erp编码
      'wbs_code', // wbs编码
      'country', // 项目所在国
      'province', // 项目所在省/直辖市
      'city', // 城市
      'area', // 区域
      'address', // 项目部详细地址
      'branch_comp_name', // 上报单位(分公司)
      'dep_name', // 项目经理部
      'project_name', // 项目名称
      'construction_dep', // 建设单位
      'contract_say_price', // 合同金额(含税)
      'contract_mode_name', // 合同类型
      'specialty_type_name', // 专业类型
      'project_level_name', // 项目等级
      'contract_start_date_format', // 合同开工日期
      'contract_end_date_format', // 合同完工日期
      'actual_start_date_format', // 实际开工日期
      'actual_end_date_format', // 实际完工日期
      'plan_finish_date_format', // 预计完工日期
      'next_month_plan', // 本月计划（%）
      'curr_month_reality', // 本月实际进度（%）
      'curr_month_plan', // 当前累计计划进度（%）
      'cumulative_month_reality', // 当前累计实际进度（%）
      'difference', // 差值
      'delay_reasons', // 滞后原因
      'year', // 统计年
      'month', // 统计月
      'month_plan_total_value', // 本月计划产值（万元）
      'month_reality_total_value', // 本月实际产值（万元）
      'annual_plan_output_value', //  本年计划产值（万元）
      'curr_year_output_value', // 本年实际产值（万元）
      'cumulative_output_value', // 自开工累计产值（万元）
      'project_manager', // 项目经理
      'manager_phone', // 项目经理联系电话
      'project_contact', // 项目联系人
      'contact_phone', // 项目联系人电话
      'designer_total_count', // 设计人员
      'manager_total_count', // 管理人员
      'worker_total_count', // 施工人员
      'hrp_total_count', // 采办人员
      'owner_group_name', // 系统分类
      'project_status_name', // 项目状态
      'project_subject', // 项目概况
      'project_quantities', // 项目工程量
      'next_plan', // 本月计划安排形象进度描述及主要节点安排
      'this_month', // 实际完成进度描述
    ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="work_permit_code"
        title={formatMessage({ id: 'wrokLicenseRegister' }) + formatMessage({ id: 'base.user.list.detail' })}
        columns={getTableColumns()}
        open={visible}
        onClose={onCancel}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      />
    </>
  );
};

export default connect()(WorkLicenseRegisterDetail);
