import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import ContractSelectInput from "./ContractSelect";


const { CrudAddModal } = SingleTable;

/**
 * 新增质量大检查及专项检查情况
 * @param props
 * @constructor
 */
const QualityInspectionAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '工程名称',
          subTitle: '工程名称',
          dataIndex: 'project_name',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <ContractSelectInput
              placeholder="请选择工程名称"
              displayField="project_name"
              tableTitle='在建项目'
              modalTitle='选择在建项目'
              type="qualityProjectQualityOverview/getQualityProjectQualityOverview"
              onChange={(record: any) => {
                console.log(record,'record');

                form.setFieldsValue({
                  project_name: record?.project_in_progress_name || record,
                });
              }}
            />
          ),
        },
        'check_time',
        'check_unit',
        'main_problems',
        'rectification',
      ])
      .setFormColumnToDatePicker([
        {value: 'check_time', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToRules([
        "project_name",
        "check_time",
        "check_unit",
        "main_problems",
        "rectification",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增质量大检查及专项检查情况"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "qualityInspection/addQualityInspection",
            payload: values,
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

export default connect()(QualityInspectionAdd);
