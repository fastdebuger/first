import React, { useRef } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, DatePicker, } from "antd";
import moment from "moment";

const { CrudAddModal } = SingleTable;

/**
 * 编辑月度重大质量风险
 * @param props
 * @constructor
 */
const RiskMonthlyPageEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord = {} } = props;
  const { formatMessage } = useIntl();

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
          renderSelfForm: (form: any) => {
            const handleChange = (_date: any, dateString: any) => {
              if (!dateString) return
              form.setFieldsValue({ month: moment(dateString) });
            }
            return (
              <DatePicker disabled style={{ width: "100%" }} onChange={handleChange} picker="month" format='MM' />
            )
          }
        },
        'project', // 工程名称
        'construction_specialty', // 施工专业/过程
        'job_activity', // 作业活动/作业部位
        'risk', // 风险
        'risk_description', // 风险描述
        'leader', // 公司片区督导领导
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year', format: 'YYYY' },

      ])
      .setFormColumnToInputTextArea([
        { value: 'qualification_change' }
      ])
      .needToDisabled([
        'year',
      ])
      .needToRules([
        'year',
        'month',
        'project', // 工程名称
        'construction_specialty', // 施工专业/过程
        'job_activity', // 作业活动/作业部位
        'risk', // 风险
        'risk_description', // 风险描述
        'leader', // 公司片区督导领导
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"编辑月度重大质量风险"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        year: String(selectedRecord?.year),
        month: moment(`${selectedRecord?.month?.toString()}`), // 月份转换为字符串
        is_comp_risk: selectedRecord?.is_comp_risk + '',
        is_sub_risk: selectedRecord?.is_sub_risk + '', 
        is_project_risk: selectedRecord?.is_project_risk + '',
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateRiskMonthly",
            payload: {
              ...selectedRecord,
              ...values,
              month: Number(values?.month?.format("MM")),

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

    </CrudAddModal>
  );
};

export default connect()(RiskMonthlyPageEdit);
