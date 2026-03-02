import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import AccountingSubjectList from "@/components/CommonList/AccountingSubjectList";
import ProfitCenterList from "@/components/CommonList/ProfitCenterList";
import PopulateCardWithData from "@/pages/Contract/Expenditure/PopulateCardWithData";
import {showTS} from "@/utils/utils-date";
import {queryWbsDefineCompare} from "@/services/finance/wbsDefineCompare";

const { CrudAddModal } = SingleTable;

/**
 * 新增税金台账
 * @param props
 * @constructor
 */
const TaxBookAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedMonth } = props;
  const { formatMessage } = useIntl();
  const propKey = localStorage.getItem('auth-default-wbs-prop-key');
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
        "month",
        // "accounting_subject",
        propKey === 'dep' ? {
          title: 'compinfo.contract_no', // 对应的主合同 ERP 项目编号
          subTitle: "合同编码", // 副标题
          dataIndex: "contract_no", // 数据索引
          width: 160, // 列宽
          align: 'center', // 对齐方式
          renderSelfForm: (form: any) => { // 自定义表单渲染
            return (
              <PopulateCardWithData
                onSelect={async (values: any) => {
                  form.setFieldsValue({ // 设置表单字段值
                    contract_no: values.contract_no,
                  })
                }}
                onCardCancel={() => {
                  form.resetFields();
                }}
              />
            )
          }
        } : '',
        {
          title: "compinfo.accounting_subject",
          subTitle: "会计科目",
          dataIndex: "accounting_subject",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange = (val, fields) => {
              form.setFieldsValue({
                accounting_subject: val,
                accounting_subject_descripe: fields.accounting_subject_descripe,
              })
            }
            return(
              <AccountingSubjectList onChange={onChange}/>
            )
          }
        },
        "accounting_subject_descripe",
        "funtional_scope",
        "funtional_scope_descripe",
        "beginning_month_amount",
        "debit_amount",
        "creditor_amount",
        "ending_month_amount",
        // "profit_center_code",
        {
          title: "compinfo.profit_center_code",
          subTitle: "利润中心",
          dataIndex: "profit_center_code",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange = (val, fields) => {
              form.setFieldsValue({
                profit_center_code: val,
                profit_wbs_name: fields.profit_wbs_name,
              })
            }
            return(
              <ProfitCenterList onChange={onChange}/>
            )
          }
        },
        "voucher_no",
        "voucher_detail",
        "row_project",
      ])
      .setFormColumnToInputNumber([
        {value: 'beginning_month_amount', valueType: 'digit'},
        {value: 'debit_amount', valueType: 'digit',},
        {value: 'creditor_amount', valueType: 'digit',},
        {value: 'ending_month_amount', valueType: 'digit',},
        {value: 'row_project', valueType: 'digit'},
      ])
      .setFormColumnToSelfColSpan([ // 设置自定义列跨度的列
        {
          colSpan: 24,
          value: 'contract_no',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .needToRules([
        "month",
        "accounting_subject",
        propKey === 'dep' ? 'contract_no' : '',
        // "accounting_subject_descripe",
        "beginning_month_amount",
        "debit_amount",
        "creditor_amount",
        "ending_month_amount",
        "profit_center_code",
        "voucher_no",
        "voucher_detail",
        "row_project",
      ])
      .needToDisabled([
        'month',
        // 'accounting_subject_descripe'
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增税金台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        month: selectedMonth,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "taxBook/addTaxBook",
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

export default connect()(TaxBookAdd);
