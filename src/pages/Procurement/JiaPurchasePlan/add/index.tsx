import React, { useRef, useState } from 'react';
import { connect, useIntl, history } from 'umi';
import { InputNumber, message, Modal, Spin } from 'antd';
import { BasicEditableColumns, BasicFormColumns } from 'qcx4-components';
import BaseFormOperatorTable from '@/components/BaseFormOperatorTable';
import { configColumns } from '../columns';
import { ErrorCode } from '@/common/const';
import FormBakDataModal from '../modal';
import DevList from '@/components/CommonList/DevList';
import UnitProjectList from '@/components/CommonList/UnitProjectList';
import UnitList from '@/components/CommonList/UnitList';
import { getTS } from '@/utils/utils-date';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';


/**
 * 新增需求计划
 * @param props
 * @constructor
 */
const JiaPurchasePlanAdd = (props: any) => {
  const { dispatch, visible, onCancel, onSucess } = props;
  const childRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
  const { formatMessage } = useIntl();
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns);
    cols
      .initFormColumns([
        'form_no_show',
        'form_date',
        {
          title: 'material.dev_code',
          subTitle: '装置编码',
          dataIndex: 'dev_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            const onChange = (value: string) => {
              form.current.setFieldsValue({
                dev_code: value,
                unit_project_code: '',
                unit_code: '',
              });
            };
            return <DevList onChange={onChange} />;
          },
        },
        {
          title: 'material.unit_project_code',
          subTitle: '单位工程编码',
          dataIndex: 'unit_project_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            const onChange = (value: string) => {
              form.current.setFieldsValue({ unit_project_code: value, unit_code: '' });
            };
            return <UnitProjectList onChange={onChange} />;
          },
        },
        {
          title: 'material.unit_code',
          subTitle: '单元编码',
          dataIndex: 'unit_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            return <UnitList />;
          },
        },
        {
          title: '供货类型',
          subTitle: "供货类型",
          dataIndex: "supply_type",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                isExpand={false}
                dispatch={dispatch}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                optionFilterProp={'dict_name'}
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Operator": "=", "Val": "SUPPLY_TYPE" }]),
                }}
              />
            )
          }
        },
        {
          title: '物料类型',
          subTitle: "物料类型",
          dataIndex: "plan_materials_type",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                isExpand={false}
                dispatch={dispatch}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                optionFilterProp={'dict_name'}
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{
                    "Key": "sys_type_code",
                    "Operator": "=",
                    "Val": "PLAN_MATERIALS_TYPE"
                  }]),
                }}
              />
            )
          }
        },
        {
          title: '仓库名称',
          subTitle: "仓库名称",
          dataIndex: "warehouse_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                isExpand={false}
                dispatch={dispatch}
                fieldNames={{ label: 'warehouse_name', value: 'id' }}
                optionFilterProp={'warehouse_name'}
                fetchType='warehouseInfo/getWarehouseInfo'
                payload={{
                  sort: 'warehouse_code',
                  order: 'asc',
                }}
              />
            )
          }
        },
        'remark',
      ])
      .setFormColumnToDatePicker([{ value: 'form_date', valueType: 'dateTs', format: 'Timestamp' }])
      .needToRules(['form_date', 'dev_code', 'unit_project_code', 'unit_code', 'supply_type', 'plan_materials_type', 'warehouse_code']);
    return cols.getNeedColumns();
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'cls_name',
        'prod_name',
        'spec',
        'unit',
        'material',
        isShowNetAndMargin ? {
          title: '图纸净量',
          dataIndex: 'plan_net_num',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = e.target.value
              const num2 = record.plan_margin_num || 0
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                plan_net_num: num,
                plan_num: Number(num) + Number(num2)
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} />
          },
        } : "",
        isShowNetAndMargin ? {
          title: '图纸裕量',
          dataIndex: 'plan_margin_num',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = e.target.value
              const num2 = record.plan_net_num || 0
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                plan_margin_num: num,
                plan_num: Number(num) + Number(num2)
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} />
          },
        } : '',
        'plan_num',
        'arrival_place',
        'demand_time',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_describe',
        'auxiliary1_unit',
        'auxiliary1_num',
        'auxiliary2_unit',
        'auxiliary2_num',
        'prod_memo',
      ])
      .setTableColumnToDatePicker([{ value: 'demand_time', valueType: 'dateTs' }])
      .setTableColumnToInputNumber([
        { value: 'plan_num', valueType: 'digit' },
        { value: 'auxiliary1_num', valueType: 'digit' },
        { value: 'auxiliary2_num', valueType: 'digit' },
      ])
      .noNeedToEditable([
        'material',
        'prod_code',
        'cls_name',
        'prod_name',
        isShowNetAndMargin ? 'plan_num' : '',
        'spec',
        'unit',
        'prod_describe'
      ])
      .setEditTableHeaderTitleBatchIconToInput([
        { value: 'arrival_place', showTableColumns: ['prod_code', 'arrival_place'] },
        { value: 'pipe_code', showTableColumns: ['prod_code', 'pipe_code'] },
        { value: 'pipe_image_no', showTableColumns: ['prod_code', 'pipe_image_no'] },
        { value: 'pipe_section_code', showTableColumns: ['prod_code', 'pipe_section_code'] },
        { value: 'prod_memo', showTableColumns: ['prod_code', 'prod_memo'] },
      ])
      .needToRules([
        isShowNetAndMargin ? 'plan_net_num' : '',
        isShowNetAndMargin ? 'plan_margin_num' : '',
        'plan_num', 'pipe_code', 'pipe_image_no', 'pipe_section_code']);
    return cols.getNeedColumns();
  };
  /**
   * 操作按钮
   * @param handleAdd
   * @param handleBatchAdd
   * @param form
   */
  const toolBarRender = (handleAdd: any, handleBatchAdd: (arg0: any) => void, form: any) => {
    return [
      <FormBakDataModal
        form={form}
        onOk={(selectedRows: any) => {
          selectedRows.forEach((item: any) => {
            Object.assign(item, {
              plan_num: 0,
              plan_net_num: 0,
              plan_margin_num: 0,
            });
          });
          handleBatchAdd(selectedRows);
        }}
      />,
    ];
  };
  /**
   * 点击提交后的执行的函数
   * @param fields
   */
  const callbackCommitData = async (fields: any) => {
    const { addItems, editItems, delItems, dataSource, form } = fields;
    const values = await form.validateFields();
    // setLoading(true)
    addItems.forEach((item: any) => {
      Object.assign(item, {
        plan_net_num: item.plan_net_num || 0,
        plan_margin_num: item.plan_margin_num || 0,
      })
    })
    dispatch({
      type: 'jiapurchaseplan/addPurchasePlan',
      payload: {
        ...values,
        Items: JSON.stringify(addItems),
      },
      callback: (res: any) => {
        // setLoading(false)
        childRef.current.cancelCommitButtonLoading();
        if (res.errCode === ErrorCode.ErrOk) {
          message.success(formatMessage({ id: 'common.list.add.success' }));
          onSucess();
        }
      },
    });
  };
  return (
    <Modal
      title="需求计划新增"
      visible={visible}
      onCancel={onCancel}
      onOk={async () => {
        const res = await childRef.current.getCommitData();
        callbackCommitData(res);
      }}
      width={'100vw'}
      style={{ top: 0, maxWidth: '100vw', padding: 0, overflowX: 'hidden' }}
      bodyStyle={{ height: 'calc(100vh - 110px)', padding: 10, overflowX: 'hidden' }}
    >
      <Spin tip="Loading..." spinning={loading}>
        <BaseFormOperatorTable
          funcCode={'D51F207_add'}
          cRef={childRef}
          toolBarRender={toolBarRender}
          initFormValues={{ form_date: getTS() }} // 初始化表单数据
          initDataSource={[]} // 初始化表格数据
          formColumns={getFormColumns()}
          tableColumns={getTableColumns()}
          //callbackCommitData={callbackCommitData}
          scroll={{ y: 'calc(100vh - 440px)' }}
        />
      </Spin>
    </Modal>
  );
};

export default connect()(JiaPurchasePlanAdd);
