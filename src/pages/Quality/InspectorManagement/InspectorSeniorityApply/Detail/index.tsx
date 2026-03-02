import React, { useState, useMemo } from "react";
import { Button, message, Modal, Space, Table } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { resumeColumns, configColumns } from "../columns";
import Edit from "../Edit";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 作业许可证登记表详情
 * @param props
 * @constructor
 */
const InspectorSeniorityApplyDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();
  // 解析工作简历数据
  const resumeData = useMemo(() => {
    if (selectedRecord?.job_resume) {
      return JSON.parse(selectedRecord.job_resume);
    }
    return [];
  }, [selectedRecord]);
  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'sub_comp_code',
      'dep_code',
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
      'approval_date',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name'
    ])
    .setTableColumnToDatePicker([
      {value: 'approval_date', valueType: 'dateTs' },
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

  /**
   * 处理详情删除操作
   * @description 该函数用于删除工作许可证记录，通过dispatch触发删除操作
   * 删除成功后显示提示信息并执行回调函数
   */
  const handleDel = () => {
    // 触发删除工作许可证接口
    dispatch({
      type: "workLicenseRegister/deleteInspectorApplication",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        // 检查删除操作是否成功
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          // 延迟执行关闭和成功回调函数
          setTimeout(() => {
            if (onCancel) onCancel();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="name"
        title={formatMessage({ id: 'InspectorSeniorityApply' }) + formatMessage({ id: 'base.user.list.detail' })}
        columns={getTableColumns()}
        open={visible}
        onClose={onCancel}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <h3>工作简历</h3>
        {resumeData.length > 0 && (
          <Table
            columns={resumeColumns}
            dataSource={resumeData || []}
            rowKey={(record, index) => index?.toString() || '0'}
            pagination={false}
            size="small"
            bordered
          />
        )}
      </CrudQueryDetailDrawer>

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
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={"primary"} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>是否删除当前的数据: {selectedRecord["name"]}</p>
      </Modal>
    </>
  );
};

export default connect()(InspectorSeniorityApplyDetail);
