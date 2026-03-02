import React, { useRef } from "react";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";

import { configColumns } from "../columns";
import QuestionnaireRating from "../QuestionnaireRating";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 公司风险评估调查表详情
 * @param props
 * @constructor
 */
const AnnualAssessmentDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord } = props;
  const questionnairegRef = useRef<{ getAssessmentConfig: () => any[], getEditAssessmentConfig: () => any[] }>(null)

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([])
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [

    ];
  };


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="report_name"
        title="公司年度重大经营风险评估数据库详情"
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
    </>
  );
};

export default connect()(AnnualAssessmentDetail);
