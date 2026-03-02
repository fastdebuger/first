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
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord = {} } = props;
  const { formatMessage } = useIntl();
  // 获取子组件评估表格数据的方法
  const questionnairegRef = useRef<{ getAssessmentConfig: () => any[], getEditAssessmentConfig: () => any[] }>(null)

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        {
          title: 'monitoringMeasuring.month',
          subTitle: '月份',
          dataIndex: 'month',
          align: 'center',
          width: 200,
          renderSelfForm: (form: any ) => {
            const handleChange = (_date: any, dateString: any) => {
              if(!dateString) return
              form.setFieldsValue({ month: moment(dateString) });
            }
            return (
              <DatePicker 
                style={{ width: "100%" }} 
                onChange={handleChange} 
                picker="month" 
                format='MM'
               />
            )
          }
        },
        'project',
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
      ])
      .needToRules([
        'year',
        'month',
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
      title={"编辑月度质量风险评估"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        year: String(selectedRecord?.year),
        month: moment(`${selectedRecord?.month.toString()}`), // 月份转换为字符串
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const Items = questionnairegRef?.current?.getEditAssessmentConfig?.() || []
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateRiskMonthly",
            payload: {
              ...selectedRecord,
              ...values,
              month: Number(values?.month?.format("MM")),
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
      />
    </CrudAddModal>
  );
};

export default connect()(RiskMonthlyPageEdit);
