import React, { useRef } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import QuestionnaireTable from "../QuestionnaireTable"


const { CrudAddModal } = SingleTable;

/**
 * 新增月度质量风险评估
 * @param props
 * @constructor
 */
const RiskMonthlyAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  // 获取子组件评估表格数据的方法
  const questionnairegRef = useRef<{ getAssessmentConfig: () => (any[] | false) }>(null)

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        'project',
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
      ])
      .needToRules ([
        'year',
        'project',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增年度质量风险评估"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: String(new Date().getFullYear()),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const Items: any[]= questionnairegRef?.current?.getAssessmentConfig?.() || [];
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addRiskAnnual",
            payload: {
              ...values,
              Items: JSON.stringify(Items),
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
      <QuestionnaireTable
        ref={questionnairegRef}
      />
    </CrudAddModal>
  );
};

export default connect()(RiskMonthlyAdd);
