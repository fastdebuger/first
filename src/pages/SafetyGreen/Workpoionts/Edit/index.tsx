import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import WbsTreeSelect from "@/components/CommonList/WbsTreeSelect";
import SelectQualitySafetyOversightFormItem from "../SelectQualitySafetyOversightFormItem";


const { CrudEditModal } = SingleTable;

/**
 * 编辑记分管理
 * @param props
 * @constructor
 */
const WorkpoiontsEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  /**
   * 表单数据
   * @returns 
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'compinfo.safety_inspection_id',
          subTitle: "选择质量清单",
          dataIndex: "safety_inspection_id",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <SelectQualitySafetyOversightFormItem form={form} record={selectedRecord} />
            )
          }
        },
        {
          title: 'compinfo.push_wbs_code',
          subTitle: "推送项目部",
          dataIndex: "push_wbs_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <WbsTreeSelect />
            )
          }
        },
        'examine_wbs_code',
        'examine_wbs_name',
        'project_name',
        'report_date',
        'problem_description',
        'question_type',
        'hazard_level',
        'branch_comp_code'
      ])
      .setFormColumnToSelect([
        {
          value: 'hazard_level',
          name: 'hazard_level_label',
          valueType: 'select',
          data: [
            {
              hazard_level: "3",
              hazard_level_label: "轻微事故隐患",
            },
            {
              hazard_level: "2",
              hazard_level_label: "一般事故隐患",
            },
            {
              hazard_level: "1",
              hazard_level_label: "较大事故隐患",
            },
            {
              hazard_level: "0",
              hazard_level_label: "重大事故隐患",
            }
          ]
        },
        {
          value: 'question_type',
          name: 'question_type_label',
          valueType: 'select',
          data: [
            {
              question_type: "1",
              question_type_label: "管理",
            },
            {
              question_type: "2",
              question_type_label: "作业",
            },
          ]
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'report_date',
          valueType: 'dateTs',
          needValueType: 'timestamp'
        },
      ])
      .setFormColumnToSelfColSpan([ // 设置自定义列跨度的列
        {
          colSpan: 24,
          value: 'safety_inspection_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .needToHide([
        'examine_wbs_code',
        'branch_comp_code'
      ])
      .needToRules([
        "safety_inspection_id",
        'push_wbs_code',
        // 'examine_wbs_code',
        'examine_wbs_name',
        'project_name',
        'report_date',
        'problem_description',
        'question_type',
        'hazard_level',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };
  return (
    <CrudEditModal
      title={"编辑记分管理"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        question_type: String(selectedRecord.question_type),
        hazard_level: String(selectedRecord.hazard_level),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workpoionts/updateInfo",
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

export default connect()(WorkpoiontsEdit);
