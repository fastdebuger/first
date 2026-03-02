import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { Alert, Form, message } from "antd";
import SelectIncomeFormItem from "../SelectIncomeFormItem";
import useSysDict from "@/utils/useSysDict";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";

const { CrudAddModal } = SingleTable;

/**
 * 新增公司业绩台账
 * @param props
 * @constructor
 */
const PerformanceLedgerAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const [isPerformanceDetail, setIsPerformanceDetail] = useState(false)
  const [form] = Form.useForm();
  const value = Form.useWatch('performance_type', form)
  const { configData } = useSysDict({
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'BID_PERFORMANCE_DETAIL'",
        "Operator": "in"
      }
    ]
  })

  /**
   * 判断用户是否输入炼油化工
   * 需要展示performance_detail字段
   */
  useEffect(() => {
    if (value === '炼油化工' || value === '炼油化工工程') {
      setIsPerformanceDetail(true)
    } else {
      setIsPerformanceDetail(false)
    }
  }, [value])

  /**
   * 表格配置
   * @returns 
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'PerformanceLedger.contract_income_id',
          subTitle: "选择收入合同",
          dataIndex: "contract_income_id",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <SelectIncomeFormItem form={form} />
            )
          }
        },
        'performance_type',
        isPerformanceDetail ? 'performance_detail' : "",
        // ---
        'project_name',
        'construction_unit',
        'branch_company',
        'contract_mode',
        'contract_type',
        'start_date',
        'end_date',
        'contract_amount',
        'work_scope',
        'contract_year',
        // ---
        'main_engineering',
        // 'contract_key_pages',
        // 'handover_report',
        ...[
          'contract_key_pages',
          'handover_report',
        ].map(item => ({
          title: 'PerformanceLedger.' + item,
          subTitle: "附件",
          dataIndex: item,
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".doc,.docx,.xls,.xlsx,.pdf"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/PerformanceLedger"
                handleRemove={() => form.setFieldsValue({ [item]: null })}
                onChange={(file) => {
                  form.setFieldsValue({ [item]: file?.response?.url })
                }}
              />
            )
          }
        })),
      ])
      .needToHide([
        'project_name',
        'construction_unit',
        'branch_company',
        'contract_mode',
        'contract_type',
        'start_date',
        'end_date',
        'contract_amount',
        'work_scope',
        'contract_year',
      ])
      .setFormColumnToSelect([
        {
          value: 'performance_detail',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.BID_PERFORMANCE_DETAIL || [],
          valueAlias: 'id',
        },
      ])
      .setFormColumnToDatePicker([
        { value: 'start_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'end_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'contract_year', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'contract_income_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .needToRules([
        "contract_income_id",
        'performance_type',
        isPerformanceDetail ? 'performance_detail' : "",
        'main_engineering',
        // 'contract_key_pages',
        // 'handover_report',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      form={form}
      title={"新增公司业绩台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "performanceLedger/saveBatch",
            payload: {
              Items: JSON.stringify([values])
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
      <Alert message="业绩类型输入“炼油化工”需要选择业绩细分" />
    </CrudAddModal>
  );
};

export default connect()(PerformanceLedgerAdd);
