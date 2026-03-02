import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, DatePicker } from "antd";
import moment from "moment";

const { CrudAddModal } = SingleTable;

/**
 * 新增计量人员资格申请表
 * @param props
 * @constructor
 */
const OutsourcedLedgerAuditAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  
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
        'project', // 工程名称
        'construction_specialty', // 施工专业/过程
        'job_activity', // 作业活动/作业部位
        'risk', // 风险
        'risk_description', // 风险描述
        'leader', // 公司片区督导领导
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
      ])
      .setFormColumnToInputTextArea([
        { value: 'qualification_change' }
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
    cols.forEach((item: any) => {
      if (item.title) {
        item.title = formatMessage({ id: item.title })
      }
    });
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增月度重大质量风险"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: String(new Date().getFullYear()),
        month: moment(),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addRiskMonthly",
            payload: {
              ...values,
              month: Number(values?.month?.format("MM")),
              
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
    />
  );
};

export default connect()(OutsourcedLedgerAuditAdd);
