import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import AccountingSubjectList from "@/components/CommonList/AccountingSubjectList";
import ProfitCenterList from "@/components/CommonList/ProfitCenterList";

const { CrudEditModal } = SingleTable;

/**
 * 编辑税金台账
 * @param props
 * @constructor
 */
const TaxBookEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
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
        "id",
        "month",
        // "accounting_subject",
        propKey === 'dep' ? 'contract_no' : '',
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
              <AccountingSubjectList disabled onChange={onChange}/>
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
      .needToRules([
        "month",
        propKey === 'dep' ? 'contract_no' : '',
        "accounting_subject",
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
      .needToHide([
        'id'
      ])
      .needToDisabled([
        'month',
        propKey === 'dep' ? 'contract_no' : '',
        // 'accounting_subject_descripe',
        // 'profit_center_code',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑税金台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "taxBook/updateTaxBook",
            payload: values,
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

export default connect()(TaxBookEdit);
