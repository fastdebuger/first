import React, { useRef } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message,DatePicker, } from "antd";
import moment from "moment";

const { CrudAddModal } = SingleTable;

/**
 * 编辑月度重大质量风险
 * @param props
 * @constructor
 */
const RiskMonthlyPageEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord = {},isDetail = false } = props;
  const { formatMessage } = useIntl();

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        'project',
        'risk_position', // 风险部位
        'risk_cause', // 风险可能产生之因
        'risk_consequence', // 风险可能导致之果
        'preventive_measures', // 预防措施/控制方案
        'responsible_dep', // 责任部门
        'responsible_person', // 责任人
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
      ])
      .needToDisabled([
        'year',
        'project',
        'risk_cause', // 风险可能产生之因
        'risk_consequence', // 风险可能导致之果
        'preventive_measures', // 预防措施/控制方案
        'responsible_dep', // 责任部门
        'responsible_person', // 责任人
      ])
      .needToRules([
        'risk_position', // 风险部位
        
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
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addRiskPositionAnnual",
            payload: {
              ...selectedRecord,
              ...values,
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
