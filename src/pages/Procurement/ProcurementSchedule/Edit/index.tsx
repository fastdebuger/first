import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import PurchaseStrategySelect from "@/components/PurchaseStrategySelect";


const { CrudEditModal } = SingleTable;

/**
 * 编辑采购进度计划
 * @param props
 * @constructor
 */
const PurchaseStrategyScheduleEdit: React.FC<any> = (props) => {
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
  }, [dispatch]);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '总体策略议题名称',
          subTitle: "总体策略议题名称",
          dataIndex: "main_form_no",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <PurchaseStrategySelect
                displayField="topic_name"
                placeholder="请选择总体策略"
                value={form.getFieldValue('main_form_no')}
                filter={[ {
                  Key: 'wbs_code',
                  Val: localStorage.getItem('auth-default-wbsCode'),
                  Operator: '='
                }]}
                onChange={(value: any) => {
                  // value 直接是 form_no
                  form.setFieldsValue({ main_form_no: value });
                }}
              />
            );
          }
        },
        'lot_name',
        'lot_no',
        'site_demand_time',
        'procurement_method',
        'plan_approve_time',
        'doc_prepare_time',
        'tech_eval_time',
        'comm_eval_time',
        'loa_time',
        'po_time',
        'procurement_wbs_code',
      ])
      .setFormColumnToDatePicker([
        { value: 'site_demand_time', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'plan_approve_time', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'doc_prepare_time', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'tech_eval_time', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'comm_eval_time', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'loa_time', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'po_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToSelect([
        {
          value: 'procurement_method',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '公开招标', value: '0' },
            { label: '邀请招标', value: '1' },
            { label: '公开询比采购', value: '2' },
            { label: '邀请询比采购', value: '3' },
            { label: '公开谈判采购', value: '4' },
            { label: '邀请谈判采购', value: '5' },
            { label: '直接采购', value: '6' },
            { label: '目录采购', value: '7' },
            { label: '执行集采结果', value: '8' },
          ] as any,
        },
      ])
      .setFormColumnToAutoComplete([
        { value: 'procurement_wbs_code', data: [] },
      ])
      .needToRules([
        'main_form_no',
        'lot_name',
        'lot_no',
        'site_demand_time',
        'procurement_method',
        'plan_approve_time',
        'doc_prepare_time',
        'tech_eval_time',
        'comm_eval_time',
        'loa_time',
        'po_time',
        'procurement_wbs_code',
      ])
      .getNeedColumns();
      cols.forEach((item: any) => {
        item.title = formatMessage({ id: item.title });
      });
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑采购进度计划"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "purchaseStrategySchedule/updatePurchaseStrategySchedule",
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

export default connect()(PurchaseStrategyScheduleEdit);
