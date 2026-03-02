import React, { useEffect, useState } from "react";
import { baseModuleList, configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, PROP_KEY } from "@/common/const";
import { Form, message } from "antd";
import WbsTreeSelect from "@/components/CommonList/WbsTreeSelect";

const { CrudAddModal } = SingleTable;

/**
 * 新增待办事项
 * @param props
 * @constructor
 */
const AnnualAssessmentAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, allUserListList } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const [isDateRestriction, setIsDateRestriction] = useState<boolean>(false);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'AnnualAssessment.push_dep_code',
          subTitle: "推送项目部",
          dataIndex: "dep_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <WbsTreeSelect />
            )
          }
        },
        "user_code",
        "funcCode",
        "sys_code",
        isDateRestriction ? 'report_start_date' : "",
        isDateRestriction ? 'report_end_date' : "",
      ])
      .needToHide(["sys_code"])
      .setFormColumnToSelect([
        {
          value: 'funcCode',
          name: 'moduleName',
          valueType: 'select',
          data: baseModuleList?.filter(item => item.isCustomEncoding) || [],
          valueAlias: "moduleCode",
          onChange(value) {
            // 根据isDateRestriction判断日期是否必填 因为有的业务需要限制日期填报的时间范围
            const list = baseModuleList.find(item => value === item.moduleCode);
            setIsDateRestriction(list?.isDateRestriction)
          },
        },
        {
          value: "user_code",
          valueType: "multiple",
          name: "user_name",
          data: allUserListList
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'report_start_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
        {
          value: 'report_end_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
      ])
      .needToRules([
        "user_code",
        "dep_code",
        "funcCode",
        "sys_code",
        isDateRestriction ? 'report_start_date' : "",
        isDateRestriction ? 'report_end_date' : "",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };


  // 初始化数据
  useEffect(() => {
    if (dispatch) {
      //allUserListList没有数据的时候，请求数据
      if (allUserListList?.length === 0) {
        // 查看人员
        dispatch({
          type: "common/queryUserInfo",
          payload: {
            sort: 'user_code',
            order: 'desc',
            filter: JSON.stringify([
              { "Key": "other_account", "Operator": "=", "Val": "01" }
            ]),
            prop_key: PROP_KEY
          }
        });
      }
    }
  }, [])


  return (
    <CrudAddModal
      form={form}
      title={"新增待办任务"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        sys_code: "D51"
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const list = baseModuleList.find(item => item.moduleCode === values.funcCode)
        const type = list?.type;
        // 发起日期填报的接口
        const DateRestrictionType = list?.DateRestrictionType;
        if (!type) {
          return new Promise(resolve => {
            message.info("请配置请求接口！")
            resolve(true)
          })
        }
        dispatch({
          type: DateRestrictionType,
          payload: {
            wbs_code: values.dep_code,
            report_start_date: values.report_start_date,
            report_end_date: values.report_end_date,
          },
        });
        return new Promise((resolve) => {
          resolve(true);
          // dispatch({
          //   type,//sendRiskAssessmentTask
          //   payload: {
          //     ...values,
          //     user_code: Array.isArray(values.user_code) ? values.user_code.join(",") : ""
          //   },
          //   callback: (res: any) => {
          //     resolve(true);
          //     if (res.errCode === ErrorCode.ErrOk) {
          //       message.success("新增成功");
          //       setTimeout(() => {
          //         callbackSuccess();
          //       }, 1000);
          //     }
          //   },
          // });
        });
      }}
    >
    </CrudAddModal>
  );
};

export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(AnnualAssessmentAdd);
