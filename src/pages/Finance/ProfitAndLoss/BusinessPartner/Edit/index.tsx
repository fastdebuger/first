import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";

const { CrudEditModal } = SingleTable;

/**
 * 编辑往来单位
 * @param props
 * @constructor
 */
const BusinessPartnerEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
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
        // "id",
        "group_code",
        "business_partner_code",
        "client_code",
        "supplier_code",
        "name_1",
        "search_2",
        "unit_category",
        "unit_category_description",
        "unit_type",
        "unit_type_description",
        "company_type",
        "company_type_description",
        "company_size",
        "company_size_description",
        "belong_company_type",
        "belong_company_type_description",
        "belong_company_name",
        "belong_company_name_description",
        "contact_hongkong",
        "contact_hongkong_description",
        "contact_inter",
        "contact_inter_description",
        "operation_status",
        "operation_status_description",
        "organization_code",
        "internal_employee_code",
        "trade_partner",
        "company_name",
      ])
      .needToRules([
        "business_partner_code",
        "belong_company_type_description",
        "trade_partner",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑往来单位"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "businessPartner/updateBusinessPartner",
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

export default connect()(BusinessPartnerEdit);
