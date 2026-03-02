import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import moment from "moment";
import HrTrainingPlanSelecetDrawer from "@/pages/HR/Common/HrTrainingPlanSelecetDrawer";
import CommonSysDict from "@/components/CommonList/CommonSysDict";

const { CrudAddModal } = SingleTable;

/**
 * 新增培训班
 * @param props
 * @constructor
 */
const HrTrainingClassAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const wbsCode = localStorage.getItem('auth-default-wbsCode') || '';
  const propKey = localStorage.getItem("auth-default-wbs-prop-key") || "";

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
        // "id",
        "wbs_code",
        "prop_key",
        "year",
        {
          title: "compinfo.plan_id",
          subTitle: "培训计划",
          dataIndex: "plan_id",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            const onChange = (item: any) => {
              form.setFieldsValue({
                plan_id: item.id,
                year: item.year,
              })
            }
            return (
              <HrTrainingPlanSelecetDrawer onChange={onChange}/>
            )
          }
        },
        "class_name",
        // "organizer",
        {
          title: "compinfo.organizer",
          subTitle: "承办单位",
          dataIndex: "organizer",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <CommonSysDict title={'承办单位'} type={'organizer'}/>
            )
          }
        },
        "training_target",
        // "training_type",
        {
          title: "compinfo.training_type",
          subTitle: "培训方式",
          dataIndex: "training_type",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <CommonSysDict noAdd title={'培训方式'} type={'training_type'}/>
            )
          }
        },
        "monitor",
      ])
      .setFormColumnToSelfColSpan([ // 设置自定义列跨度的列
        {
          colSpan: 24,
          value: 'plan_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setSplitGroupFormColumns([
        // {title: '培训计划', columns: ['plan_id'], order: 0},
        {title: '培训班信息', columns: [
            "class_name",
            "organizer",
            "training_target",
            "training_type",
            "monitor",
        ], order: 1},
      ])
      .needToHide([
        "wbs_code",
        "prop_key",
        "year",
      ])
      .needToRules([
        "wbs_code",
        "prop_key",
        "plan_id",
        "organizer",
        "class_name",
        "training_target",
        "training_type",
        "monitor",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增培训班"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        wbs_code: wbsCode,
        prop_key: propKey
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrTrainingClass/addHrTrainingClass",
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

export default connect()(HrTrainingClassAdd);
