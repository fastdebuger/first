import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";

import ExamPaperEdit from "../Edit";
import { configColumns } from "../columns";
import SelectedPartUserModal from "./SelectedPartUserModal";
import SelectedExamQuestionModal from "./SelectedExamQuestionModal";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 考卷管理详情
 * @param props
 * @constructor
 */
const ExamPaperDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "id",
      // "wbs_code",
      // "prop_key",
      // "subComp",
      // "dep",
      "paper_name",
      "module_name",
      "grade_name",
      "start_time",
      "end_time",
      "publish_status",
      "is_allow_apply_str",

      "total_score",
      "pass_score",
      "single_count",
      "single_score",
      "judge_count",
      "judge_score",
      "other_count",
      "other_score",
      "create_ts",
      // "create_tz",
      // "create_user_code",
      "create_user_name",
      // "modify_ts",
      // "modify_tz",
      // "modify_user_code",
      // "modify_user_name",
    ])
    .setTableColumnToDatePicker([
      {value: 'start_time', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'end_time', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'create_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      {value: 'modify_ts', valueType: 'dateTs', format: 'YYYY-MM-DD'},
    ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
     /* <Button style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button style={{display: hasPermission(authority, '删除') ? 'inline' : 'none'}} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,*/
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "examPaper/deleteExamPaper",
      payload: {
        create_ts: selectedRecord.create_ts,
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
        rowKey="create_ts"
        title="考卷管理"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="题目列表" key="1">
            <SelectedExamQuestionModal selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="参与人员" key="2">
            <SelectedPartUserModal selectedRecord={selectedRecord}/>
          </Tabs.TabPane>
        </Tabs>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <ExamPaperEdit
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
        <p>是否删除当前的数据: {selectedRecord["create_ts"]}</p>
      </Modal>
    </>
  );
};

export default connect()(ExamPaperDetail);
