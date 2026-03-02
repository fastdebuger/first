import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑自产产品制造质量情况
 * @param props
 * @constructor
 */
const QualityProducedProductsEdit: React.FC<any> = (props) => {
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
        'brand_name',
        'model',
        'quantity',
        'self_inspection_status',
        'superior_inspection_status',
      ])
      .setFormColumnToInputNumber([
        {value: 'quantity', valueType: 'digit', min: 0},
      ])
      .setFormColumnToDatePicker([
        {value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToRules([
        'brand_name',
        'model',
        'quantity',
        'self_inspection_status',
        'superior_inspection_status',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };
  return (
    <CrudEditModal
      title={"编辑自产产品制造质量情况"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "qualityProducedProducts/updateQualityProducedProducts",
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

export default connect()(QualityProducedProductsEdit);
