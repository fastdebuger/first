import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG,GENDER_TYPE_OPTIONS } from "@/common/const";
import { message } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';


const { CrudEditModal } = SingleTable;

/**
 * 编辑计量人员台账
 * @param props
 * @constructor
 */
const PersonnelLedger: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, isVailty } = props;
  const { formatMessage } = useIntl();
  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'employee_no',
        'name',
        'gender',
        'education',
        'job_title', // 职称
        'metrologist_certificate',
        'laboratory_certificate',
        'verification_certificate',
        'calibration_certificate',
        'qualified_project_1',
        'validity_date_1',
        'qualified_project_2',
        'validity_date_2',
        'qualified_project_3',
        'validity_date_3',
        'qualified_project_4',
        'validity_date_4',
        'qualified_project_5',
        'validity_date_5',
        'remark',
        // 'application_project',
        {
          title: "contract.file_url",
          dataIndex: "url",
          subTitle: "附件",
          width: 300,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/Engineering/WorkLicenseRegister"
                handleRemove={() => {
                  form.setFieldsValue({ url: null })
                }}
                /**
                 * 文件上传变更处理函数
                 * @param file - 上传的文件的信息
                 */
                onChange={(file: any) => {
                  form.setFieldsValue({ url: file?.response?.url })
                }}
              />
            )
          }
        },
      ])
      .setFormColumnToSelect([
        {value: 'gender', name: 'gender', valueType: 'select', data: GENDER_TYPE_OPTIONS || []},
      ])
      .setFormColumnToInputTextArea([
        { value: 'remark' }
      ])
      .setSplitGroupFormColumns([
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .setFormColumnToDatePicker([
        {value: 'validity_date_1', valueType: 'dateTs', needValueType: 'date'},
        {value: 'validity_date_2', valueType: 'dateTs', needValueType: 'date'},
        {value: 'validity_date_3', valueType: 'dateTs', needValueType: 'date'},
        {value: 'validity_date_4', valueType: 'dateTs', needValueType: 'date'},
        {value: 'validity_date_5', valueType: 'dateTs', needValueType: 'date'},

      ])
      .needToDisabled(isVailty ? [
        'qualified_project_1',
        'qualified_project_2',
        'qualified_project_3',
        'qualified_project_4',
        'qualified_project_5',
      ] : [
        'qualified_project_1',
        'validity_date_1',
        'qualified_project_2',
        'validity_date_2',
        'qualified_project_3',
        'validity_date_3',
        'qualified_project_4',
        'validity_date_4',
        'qualified_project_5',
        'validity_date_5',
      ])
      .needToDisabled([
        'employee_no',
        'name',
        'gender',
        'education',
        'job_title', // 职称
      ])
      .needToRules([
        'metrologist_certificate',
        'laboratory_certificate',
        'verification_certificate',
        'calibration_certificate',
        
        'application_project',
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
    <CrudEditModal
      title={"编辑计量人员台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateMeasurePersonnel",
            payload: {
              ...selectedRecord,
              ...values,
              on_duty: undefined,
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

export default connect()(PersonnelLedger);
