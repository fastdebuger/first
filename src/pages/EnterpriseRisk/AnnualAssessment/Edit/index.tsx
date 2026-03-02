import React, { useRef } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import QuestionnaireRating from "../QuestionnaireRating";


const { CrudAddModal } = SingleTable;

/**
 * 编辑公司风险评估调查表
 * @param props
 * @constructor
 */
const AnnualAssessmentEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord = {} } = props;
  // console.log('selectedRecord :>> ', selectedRecord);
  const { formatMessage } = useIntl();
  const questionnairegRef = useRef<{ getAssessmentConfig: () => any[], getEditAssessmentConfig: () => any[] }>(null)

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'report_name',
        'post_name',
        'weight',
        // "possibility_score",
        // "influence_score",
      ])
      .setFormColumnToInputNumber([
        {
          value: "weight",
          valueType: "digit",
          max: 1
        }
      ])
      .needToRules([
        'report_name',
        'post_name',
        'weight',
        // "possibility_score",
        // "influence_score",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"编辑公司风险评估调查表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const Items = questionnairegRef?.current?.getEditAssessmentConfig?.() || []
        return new Promise((resolve) => {
          dispatch({
            type: "annualAssessment/updateBatch",
            payload: {
              main_id:selectedRecord.main_id,
              ...values,
              Items: JSON.stringify(Items)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    >
      <QuestionnaireRating
        ref={questionnairegRef}
        main_id={selectedRecord.main_id}
      />
    </CrudAddModal>
  );
};

export default connect()(AnnualAssessmentEdit);
