import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudAddModal } = SingleTable;

/**
 * 新增供应商信息台账
 * @param props
 * @constructor
 */
const SupplierInfoAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'id',
        'supplier_code',
        'supplier_name',
        'supplier_status',
        'supplier_level',
        'collaboration_status',
        'bank_account',
        'address',
        'product_access',
        'contact_person',
        'contact_phone',
        'supply_content',
        'remark',
      ])
      .setFormColumnToSelect([
        {
          value: 'supplier_status',
          name: 'supplier_status_str',
          valueType: 'select',
          data: [
            {
              supplier_status: '在用',
              supplier_status_str: '在用'
            },
            {
              supplier_status: '停用',
              supplier_status_str: '停用'
            },
            {
              supplier_status: '待审核',
              supplier_status_str: '待审核'
            },
          ]
        },
        {
          value: 'collaboration_status',
          name: 'collaboration_status_str',
          valueType: 'select',
          data: [
            {
              collaboration_status: '支持',
              collaboration_status_str: '支持'
            },
            {
              collaboration_status: '不支持',
              collaboration_status_str: '不支持'
            }
          ]
        },
      ])
      .needToRules([
        'supplier_code',
        "supplier_name",
        "contact_person",
        "contact_phone",
      ])
      .needToHide([
        "id",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增供应商信息台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "supplierInfo/addSupplierLedger",
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

export default connect()(SupplierInfoAdd);
