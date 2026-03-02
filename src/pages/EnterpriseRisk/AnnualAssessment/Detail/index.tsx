import React, { useRef, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import AnnualAssessmentEdit from "../Edit";
import { configColumns } from "../columns";
import QuestionnaireRating from "../QuestionnaireRating";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 公司风险评估调查表详情
 * @param props
 * @constructor
 */
const AnnualAssessmentDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const questionnairegRef = useRef<{ getAssessmentConfig: () => any[], getEditAssessmentConfig: () => any[] }>(null)

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      // "RowNumber",
      // "config_id",
      "risk_name",
      "report_name",
      "post_name",
      "weight",
      // "possibility_score",
      // "influence_score",
      "create_by_name",
      "update_by_name",

      "wbs_name",
      "create_date_str",
      "update_date_str",
    ])
      .setTableColumnToDatePicker([
        { value: 'create_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'update_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
    return cols.getNeedColumns();
  };
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

  const handleDel = () => {
    dispatch({
      type: "annualAssessment/delInfo",
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
        rowKey="id"
        title="公司风险评估调查表"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <QuestionnaireRating
          ref={questionnairegRef}
          main_id={selectedRecord.main_id}
          isDetail={true}
        />
      </CrudQueryDetailDrawer>
      {editVisible && (
        <AnnualAssessmentEdit
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
        <p>是否删除当前的数据?</p>
      </Modal>
    </>
  );
};

export default connect()(AnnualAssessmentDetail);
