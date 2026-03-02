import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑焊工资格情况统计
 * @param props
 * @constructor
 */
const WeldQualificationSunmaryEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'cert_no',
        'steel_seal_no',
        'first_date',
        'valid_project',
        'cer_approval_date',
        'valid_date',
        'project_category',
      ])
      .needToDisabled([
        'valid_date',

      ])
      .needToRules([
        'cert_no',
        'steel_seal_no',
        'valid_project',
        'cer_approval_date',
        'valid_date',
        'project_category',
      ])
      .setFormColumnToDatePicker([
        { value: 'first_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'cer_approval_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'valid_date', valueType: 'dateTs', needValueType: 'date' },
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑焊工资格情况统计"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateWelderQualification",
            payload: {
              ...selectedRecord,
              ...values
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
    />
  );
};

export default connect()(WeldQualificationSunmaryEdit);
