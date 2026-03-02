import React, { useRef } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message,DatePicker, } from "antd";
import QuestionnaireTable from "../QuestionnaireTable";
import moment from "moment";

const { CrudAddModal } = SingleTable;

/**
 * 编辑公司风险评估调查表
 * @param props
 * @constructor
 */
const RiskMonthlyPageEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord = {},isDetail = false } = props;
  const { formatMessage } = useIntl();
  // 获取子组件评估表格数据的方法
  const questionnairegRef = useRef<{ getAssessmentConfig: () => any[], getEditAssessmentConfig: () => any[] }>(null)
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        'project',
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
      ])
      .needToDisabled(isDetail && [
        'year',
        'project',
      ])
      .needToRules([
        'year',
        'project',
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
      title={"编辑年度质量风险评估"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        year: String(selectedRecord?.year),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const Items = questionnairegRef?.current?.getEditAssessmentConfig?.() || [];
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateRiskAnnual",
            payload: {
              ...selectedRecord,
              ...values,
              Items: JSON.stringify(Items)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
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
        main_id={selectedRecord.main_id}
        selectedRecord={selectedRecord}
        isDetail={isDetail}
      />
    </CrudAddModal>
  );
};

export default connect()(RiskMonthlyPageEdit);
