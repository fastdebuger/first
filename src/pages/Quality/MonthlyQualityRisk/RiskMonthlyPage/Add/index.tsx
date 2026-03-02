import React, { useRef } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, DatePicker } from "antd";
import QuestionnaireTable from "../QuestionnaireTable"
import moment from "moment";


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

  /**
   * 表格列配置引用columns文件
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
              <DatePicker style={{ width: "100%" }} onChange={handleChange} picker="month" format='MM' />
            )
          }
        },
        'project',
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
      ])
      .needToRules ([
        'year',
        'month',
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
      title={"新增月度质量风险评估"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: String(new Date().getFullYear()),
        month: moment(),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const Items: any[]= questionnairegRef?.current?.getAssessmentConfig?.() || [];
        const monthStr = values?.month?.format("MM");
        // 将字符串转换为数字
        const monthNumber = monthStr ? Number(monthStr) : null;
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addRiskMonthly",
            payload: {
              ...values,
              month: monthNumber,
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
