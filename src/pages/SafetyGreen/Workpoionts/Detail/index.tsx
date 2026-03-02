import React, { useRef, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import WorkpoiontsEdit from "../Edit";
import { configColumns } from "../columns";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { getOrgLevelFieldKey } from "@/utils/utils";
const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 记分管理详情
 * @param props
 * @constructor
 */
const WorkpoiontsDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const actionRef: any = useRef();
  /**
   * 页面详情
   * @returns 
   */
  const getTableDetailsColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'push_wbs_name',
      'examine_wbs_name',
      'project_name',
      'report_date_str',
      'problem_description',
      'question_type_name',
      'hazard_level_name',
    ])
    return cols.getNeedColumns();
  };

  // 功能组
  const renderButtonToolbar = () => {
    return [
      <Button style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,
    ];
  };

  const renderTableButtonToolbar = () => {
    return [
      <Button
        type="primary"
        onClick={() => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >
        导出
      </Button>
    ]
  }

  /**
 * 页面详情
 * @returns 
 */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        "question_type_name",
        "project_name",
        "main_workpoints_str",
        "user_name",
        "total_score",
        "hazard_level_name"
      ])
      .noNeedToFilterIcon([
        "RowNumber",
      ])
      .noNeedToSorterIcon([
        "RowNumber",
      ])
      .needToExport([
        "RowNumber",
        "question_type_name",
        "project_name",
        "main_workpoints_str",
        "user_name",
        "total_score",
        "hazard_level_name"
      ])
    return cols.getNeedColumns();
  };


  const handleDel = () => {
    dispatch({
      type: "workpoionts/delInfo",
      payload: {
        main_id: selectedRecord.main_id,
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
        rowKey="main_id"
        title="记分管理"
        columns={getTableDetailsColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        {
          getOrgLevelFieldKey(true, false, false) &&
          <BaseCurdSingleTable
            cRef={actionRef}
            rowKey="main_id"
            tableTitle='安全环保事故隐患问题记分标准'
            moduleCaption='安全环保事故隐患问题记分标准'
            type="workpoionts/getUserDeductionDetail"
            exportType="workpoionts/getUserDeductionDetail"
            tableColumns={getTableColumns()}
            funcCode={"getDetailInfo安全环保事故隐患问题记分标准"}
            tableSortOrder={{ sort: 'main_id', order: 'desc' }}
            tableDefaultField={{ main_id: selectedRecord.main_id }}
            buttonToolbar={renderTableButtonToolbar}
            selectedRowsToolbar={undefined}
            rowSelection={null}
            tableDefaultFilter={[]}
          />
        }
      </CrudQueryDetailDrawer>
      {editVisible && (
        <WorkpoiontsEdit
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
        <p>是否删除当前的数据: {selectedRecord["main_id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(WorkpoiontsDetail);
