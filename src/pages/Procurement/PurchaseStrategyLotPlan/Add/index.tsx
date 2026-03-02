import React, { useState } from "react";
import { Button, message } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { materialsColumns, subcontractColumns, serviceColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";
import PurchaseStrategySelect from "./PurchaseStrategySelect";

const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增工程物资单个标段策划方案
 * @param props
 * @returns
 */
const PurchaseStrategyLotPlanAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess, activeTab = '0' } = props;
  const { formatMessage } = useIntl();

  const baseColumns =
    activeTab === '1' ? subcontractColumns : activeTab === '2' ? serviceColumns : materialsColumns;

  const [record, setRecord] = useState<any>({});

  const getFormColumns = () => {
    const cols = new BasicFormColumns(baseColumns)
      .initFormColumns([
        {
          title: '单个标段编号',
          subTitle: "单个标段编号",
          dataIndex: "lot_no",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <PurchaseStrategySelect
                displayField="lot_no"
                placeholder="请选择采购进度计划"
                value={form.current?.getFieldValue('lot_no')}
                filter={[{
                  Key: 'dep_code',
                  Val: localStorage.getItem('auth-default-wbsCode') + '%',
                  Operator: 'like'
                }]}
                onChange={(data: any) => {
                  form.current?.setFieldsValue({
                    schedule_form_no: data.form_no,
                    lot_no: data.lot_no,
                    lot_name: data.lot_name,
                    warranty_period_req: data.warranty_period_req,
                    main_form_no: data.main_form_no,
                  });
                  setRecord(data);
                }}
              />
            );
          }
        },
        'main_form_no',
        'schedule_form_no',
        'lot_name',
        'package_type',
        'materials_type',
        'is_owner_controlled',
        'control_level',
        'rfq_no',
        'cost_control_range',
        'item_code',
        'material_grade',
        'is_sub_allowed',
        'sub_allowed_reason',
        'source_reason_desc',
        'legal_basis',
        'method_summary_technology',
        'method_summary_total',
        'site_demand_time',
        'delivery_terms_dom',
        'delivery_terms_intl',
        'payment_terms',
        'guarantee_prepay',
        'guarantee_perf',
        'guarantee_quality',
        'warranty_period_req',
        'disqualify_criteria',
        'other_elements',
        'remark',
      ])
      .setFormColumnToDatePicker([
        { value: 'site_demand_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToRules([
        'schedule_form_no',
        'lot_no',
        'lot_name',
        'package_type',
        'materials_type',
        'is_owner_controlled',
        'control_level',
        'rfq_no',
        'cost_control_range',
        'item_code',
        'material_grade',
        'is_sub_allowed',
        'sub_allowed_reason',
        'source_reason_desc',
        'legal_basis',
        'method_summary_technology',
        'method_summary_total',
        'site_demand_time',
        'delivery_terms_dom',
        'delivery_terms_intl',
        'payment_terms',
        'guarantee_prepay',
        'guarantee_perf',
        'guarantee_quality',
        'warranty_period_req',
        'disqualify_criteria',
        'other_elements',
      ])
      .setFormColumnToInputNumber([
        { value: 'cost_control_range', valueType: 'digit' },
      ])
      .needToHide(['schedule_form_no','main_form_no'])
      .setFormColumnToSelect([
        {
          value: 'materials_type',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '长周期物资', value: 0 },
            { label: '关键物资', value: 1 },
            { label: '其他', value: 2 },
          ] as any,
        },
        {
          value: 'is_owner_controlled',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '甲定乙采', value: 0 },
            { label: '甲控乙采', value: 1 },
            { label: '乙采', value: 2 },
            { label: '/', value: 3 },
          ] as any,
        },
        {
          value: 'control_level',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '集团公司工程和物装管理部', value: 0 },
            { label: '中油工程', value: 1 },
            { label: '/', value: 2 },
          ] as any,
        },
        {
          value: 'material_grade',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '一级', value: 0 },
            { label: '二级', value: 1 },
          ] as any,
        },
        {
          value: 'is_sub_allowed',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '不允许', value: 0 },
            { label: '允许', value: 1 },
          ] as any,
        },
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(baseColumns)
      .initTableColumns([
        'supplier_name',
        'supplier_source',
        'supplier_reg_addr',
        'origin_requirement',
        'supplier_code',
        'supplier_category',
        'procurement_method',
        'eval_method',
        'lot_division',
        'proposed_qty',
        'currency',
        'purchase_obs_code',
      ])
      .setTableColumnToInputNumber([
        { value: 'proposed_qty', valueType: 'digit' },
      ])
      .needToRules([
        'supplier_name',
        'supplier_source',
        'supplier_reg_addr',
        'origin_requirement',
        'supplier_code',
        'supplier_category',
        'procurement_method',
        'eval_method',
        'lot_division',
        'proposed_qty',
        'currency',
        'purchase_obs_code',
      ])
      .setTableColumnToSelect([
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
        {
          value: 'eval_method',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '技术合格 经评审最低投标价法', value: '0' },
            { label: '综合评分法', value: '1' },
          ] as any,
        },
        {
          value: 'currency',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '人民币（CNY）', value: 'CNY' },
            { label: '美元（USD）', value: 'USD' },
            { label: '韩元（KRW）', value: 'KRW' },
            { label: '欧元（EUR）', value: 'EUR' },
            { label: '日元（JPY）', value: 'JPY' },
            { label: '港币（HKD）', value: 'HKD' },
            { label: '英镑（GBP）', value: 'GBP' },
            { label: '新加坡元（SGD）', value: 'SGD' },
            { label: '泰铢（THB）', value: 'THB' },
            { label: '澳元（AUD）', value: 'AUD' },
            { label: '加拿大元（CAD）', value: 'CAD' },
            { label: '瑞士法郎（CHF）', value: 'CHF' },
          ] as any,
        },
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const toolBarRender = (handleAdd: any) => {
    return [
      <Button
        key="add"
        type="primary"
        onClick={() => {
          handleAdd({ ...record,'currency': record.currency_type});
        }}
      >新增</Button>
    ];
  };

  return (
    <CrudAddModal
      title={"新增工程物资单个标段策划方案"}
      visible={visible}
      onCancel={onCancel}
      formColumns={getFormColumns()}
      initFormValues={{ lot_category: Number(activeTab) }}
      initDataSource={[]}
      toolBarRender={toolBarRender}
      tableColumns={getTableColumns()}
      onCommit={(data: any) => {
        const { addItems, form } = data;
        const values = form.getFieldsValue();
        console.log(values,'values');
        
        return new Promise((resolve: any) => {
          if (!addItems.length) {
            return resolve(true);
          }
          dispatch({
            type: "purchaseStrategyLotPlan/addPurchaseStrategyLotPlan",
            payload: {
              lot_category: Number(activeTab),
              ...values,
              Items: JSON.stringify(addItems)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(PurchaseStrategyLotPlanAdd);
