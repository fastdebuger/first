import React, { useRef, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { configColumns } from "../columns";
import { BasicTableColumns, HeaderAndBodyTable } from "yayang-ui";
import WeldExamSummaryEdit from "../Edit";
import { connect, useIntl } from "umi";
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { inspectorApprovalStatusTag } from "@/common/common";

const { CrudQueryDetailDrawer } = HeaderAndBodyTable;

/**
 * 焊工考试项目汇总详情
 * @param props
 * @returns
 */
const WeldExamSummaryDetail: React.FC<any> = (props: any) => {
  const { authority, open, onClose, selectedRecord, actionRef, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();
  const childRef: any = useRef();

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols: any = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'sub_comp_name',
      'plan_exam_time',
      'exam_address',
      'approval_date',
      'remark',
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
    ])
      .setTableColumnToDatePicker([
        { value: 'plan_exam_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'approval_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    cols.needColumns.forEach((item: any) => {
      Object.assign(item, { subTitle: formatMessage({ id: item.title }) })
    });
    return cols.getNeedColumns();
  };

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getBodyTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'name',
      "gender",
      "education_str",
      "id_card",
      'first_date',
      'exam_type',
      'valid_project',
      'valid_date',
      'is_exchange_str',
      'exam_result_str',
      'b_remark',

    ])
    return cols.getNeedColumns();
  };

  const renderButtonToolbar = () => {
    return [ ];
  };

  const handleDel = () => {
    dispatch({
      type: "workLicenseRegister/delWelderExam",
      payload: {
        h_id: selectedRecord[0]['h_id'],
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };

  /**
   * 功能按钮组
   */
  const renderBodyButtonToolbar = () => {
    return [
      <Button
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => childRef.current.exportFile()}
      >
        {formatMessage({ id: 'common.list.export' })}
      </Button>,
    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="h_id"
        title="焊工考试项目汇总"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <BaseCurdSingleTable
          cRef={childRef}
          rowKey="b_id"
          tableTitle="焊工考试项目汇总详情"
          type="workLicenseRegister/queryWelderExamBody"
          exportType="workLicenseRegister/queryWelderExamBody"
          tableDefaultFilter={[
            { Key: 'h_id', Val: selectedRecord.h_id, Operator: '=' },
          ]}
          tableColumns={getBodyTableColumns()}
          tableSortOrder={{ sort: 'b_id', order: 'desc' }}
          buttonToolbar={renderBodyButtonToolbar}
          selectedRowsToolbar={() => []}
          defaultPageSize={undefined}
          rowSelection={null}
          scroll={{ y: "calc(100vh - 320px)" }}
          height={"calc(-115px + 100vh)"}
          funcCode={authority + "-detai1l"}
        />
      </CrudQueryDetailDrawer>
      {editVisible && (
        <WeldExamSummaryEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        delVisible && (
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
            <p>是否删除当前的数据: {selectedRecord[""]}</p>
          </Modal>
        )
      }
    </>
  )
}

export default connect()(WeldExamSummaryDetail);
