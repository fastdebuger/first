import React, { useState, useMemo } from "react";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { getDisplayHierarchy } from "@/utils/utils";

import Edit from "../Edit";
import { configColumns } from "../columns";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 质量检查员资格证年审详情
 * @param props
 * @constructor
 */
const InspectorSeniorityApplyDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord, callbackSuccess } = props;
  // 用于控制编辑的状态
  const [editVisible, setEditVisible] = useState(false);
  const { formatMessage } = useIntl();
  
  /**
   * 获取表格列配置的函数
   * @returns 返回表格列的配置数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'name',
      'gender',
      'birth_date',
      'job',
      'job_title',
      'work_date',
      'education',
      'graduation_school',
      'major',
      'related_work_date',
      'apply_major',
      'quality_situation',
      'pass_percent',
      'certificate_situation',
      'reward_count',
      'reward_amount',
      'reward_personnel',
      'reward_reason',
      'fine_count',
      'fine_amount',
      'fine_personnel',
      'fine_reason',
      'accident_situation',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name'
    ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [ ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="name"
        title={formatMessage({ id: 'InspectorAnnualAudit' }) + formatMessage({ id: 'base.user.list.detail' })}
        columns={getTableColumns()}
        open={visible}
        onClose={onCancel}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      />

      {editVisible && (
        <Edit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onCancel) onCancel();
            if (callbackSuccess) callbackSuccess();
          }}
        />
      )}
    </>
  );
};

export default connect()(InspectorSeniorityApplyDetail);
