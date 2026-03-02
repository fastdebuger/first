import React, { useState, useMemo } from "react";
import { Button, message, Modal, Space, Table } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { getDisplayHierarchy } from "@/utils/utils";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import PersonnelApplyFormEdit from "../Edit";
import { configColumns, resumeColumns } from "../columns";
import { inspectorApprovalStatusTag } from "@/common/common";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 计量人员资格申请表详情
 * @param props
 * @constructor
 */
const PersonnelApplyFormDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const { formatMessage } = useIntl();
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  // 解析工作简历数据
  const resumeData = useMemo(() => {
    if (selectedRecord?.qualifications) {
      return JSON.parse(selectedRecord.qualifications);
    }
    return [];
  }, [selectedRecord]);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      "lab_full_name",
      "lab_nature",
      "qualification_scope",
      "business_license_no",
      "lab_responsible_person",
      "province_name",
      "city_name",
      "address",
      "lab_phone",
      "geo_traffic",
      "entrusted_projects",
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',
      {
        title: "contract.file_url",
        subTitle: "附件",
        dataIndex: "url",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >{formatMessage({ id: 'wrokLicenseRegister.download' })}</Button>
            )
          }
          return '/'
        }
      },
      {
        "title": "common.status",
        "subTitle": "审批状态",
        "dataIndex": "approval_status",
        "width": 160,
        "align": "center",
        render: (text: any, _record: any) => {
          return inspectorApprovalStatusTag(text);
        }
      },
      "approval_date",
    ])
      .setTableColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'train_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [];
  };

  const handleDel = () => {
    dispatch({
      type: "workLicenseRegister/deleteExternalLaboratoryEvaluation",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title="外委实验室调查评价详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <h3>资质信息</h3>
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
        <PersonnelApplyFormEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
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
        <p>是否删除当前的数据: {selectedRecord["id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(PersonnelApplyFormDetail);
