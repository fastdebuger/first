import React, {useEffect, useRef, useState} from 'react';
import {connect, useIntl} from 'umi';
import {Modal, message, Spin, InputNumber} from 'antd';
import {BasicEditableColumns, BasicFormColumns} from 'qcx4-components';
import BaseFormOperatorTable from '@/components/BaseFormOperatorTable';
import {configColumns} from '../columns';
import {ErrorCode} from '@/common/const';
import FormBakDataModal from '../modal';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';


/**
 * 修改甲供需求计划单
 * @param props
 * @constructor
 */
const JiaPurchasePlanEdit = (props: any) => {
  const {dispatch, visible, onCancel, onSucess, record} = props;
  const {formatMessage} = useIntl();
  const childRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const [initDataSource, setInitDataSource] = useState([]);
  const [headerRecord, setHeaderRecord] = useState<any>(null);
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'

  useEffect(() => {
    setLoading(true);
    dispatch({
      type: 'jiapurchaseplan/queryPurchasePlanHead',
      payload: {
        sort: 'form_no',
        order: 'asc',
        filter: JSON.stringify([{Key: 'form_no', Val: record.form_no, Operator: '='}]),
      },
      callback: (res: any) => {
        if (res && res.rows && res.rows.length > 0) {
          setHeaderRecord(res.rows[0]);
        }
      },
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: 'jiapurchaseplan/queryPurchasePlanBody',
      payload: {
        sort: 'form_no',
        order: 'asc',
        filter: JSON.stringify([{Key: 'form_no', Val: record.form_no, Operator: '='}]),
      },
      callback: (res) => {
        setLoading(false);
        if (res.rows && res.rows.length > 0) {
          setInitDataSource(res.rows);
        }
      },
    });
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns);
    cols
      .initFormColumns([
        'form_no_show',
        'form_date',
        'dev_name',
        'unit_project_name',
        'unit_name',
        {
          title: '供货类型',
          subTitle: "供货类型",
          dataIndex: "supply_type",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
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
                dispatch={dispatch}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                optionFilterProp={'dict_name'}
                fetchType='contractBasic/getSysDict'
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Operator": "=", "Val": "PLAN_MATERIALS_TYPE" }]),
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
      .setFormColumnToDatePicker([{value: 'form_date', valueType: 'dateTs', format: 'Timestamp'}])
      .needToRules(['form_date', 'dev_code', 'unit_code', 'unit_project_code','warehouse_code','supply_type','plan_materials_type'])
      .needToDisabled(['dev_name', 'unit_project_name', 'unit_name']);
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
              const num2 = record.plan_margin_num
              const copyRecord = {...record};
              Object.assign(copyRecord, {
                plan_net_num: num,
                plan_num: Number(num) + Number(num2)
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur}/>
          },
        } : '',
        isShowNetAndMargin ? {
          title: '图纸裕量',
          dataIndex: 'plan_margin_num',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = e.target.value
              const num2 = record.plan_net_num
              const copyRecord = {...record};
              Object.assign(copyRecord, {
                plan_margin_num: num,
                plan_num: Number(num) + Number(num2)
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur}/>
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
      .setTableColumnToDatePicker([{value: 'demand_time', valueType: 'dateTs'}])
      .setTableColumnToInputNumber([
        {value: 'plan_num', valueType: 'digit'},
        {value: 'auxiliary1_num', valueType: 'digit'},
        {value: 'auxiliary2_num', valueType: 'digit'},
      ])
      .noNeedToEditable([
        'material',
        'prod_code',
        'cls_name',
        'prod_name',
        'spec',
        'unit',
        isShowNetAndMargin ? 'plan_num' : "",
        'prod_describe'
      ])
      .setEditTableHeaderTitleBatchIconToInput([
        {value: 'arrival_place', showTableColumns: ['prod_code', 'arrival_place']},
        {value: 'pipe_code', showTableColumns: ['prod_code', 'pipe_code']},
        {value: 'pipe_image_no', showTableColumns: ['prod_code', 'pipe_image_no']},
        {value: 'pipe_section_code', showTableColumns: ['prod_code', 'pipe_section_code']},
        {value: 'prod_memo', showTableColumns: ['prod_code', 'prod_memo']},
      ])
      .needToRules([
        isShowNetAndMargin ? 'plan_net_num' : '',
        isShowNetAndMargin ? 'plan_margin_num' : '',
        'plan_num', 'pipe_code', 'pipe_image_no', 'pipe_section_code']);
    return cols.getNeedColumns();
  };

  const toolBarRender = (handleAdd, handleBatchAdd, form) => {
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
    const {addItems, editItems, delItems, dataSource, form} = fields;
    const values = await form.validateFields();
    setLoading(true)
    dispatch({
      type: 'jiapurchaseplan/updatePurchasePlan',
      payload: {
        dev_code: record.dev_code || '',
        unit_project_code: record.unit_project_code || '',
        unit_code: record.unit_code || '',
        ...Object.assign(headerRecord, values),
        AddItems: JSON.stringify(addItems),
        UpdateItems: JSON.stringify(editItems),
        DelItems: JSON.stringify(
          delItems && delItems.length > 0
            ? delItems.map((item: { prod_key: any }) => item.prod_key)
            : [],
        ),
      },
      callback: (res: any) => {
        setLoading(false)
        childRef.current.cancelCommitButtonLoading();
        if (res.errCode === ErrorCode.ErrOk) {
          message.success(formatMessage({id: 'common.list.edit.success'}));
          onSucess();
        }
      },
    });
  };
  return (
    <Modal
      title="需求计划编辑"
      visible={visible}
      onCancel={onCancel}
      onOk={async () => {
        const res = await childRef.current.getCommitData();
        callbackCommitData(res);
      }}
      width={'100vw'}
      style={{top: 0, maxWidth: '100vw', padding: 0, overflowX: 'hidden'}}
      bodyStyle={{height: 'calc(100vh - 110px)', padding: 10, overflowX: 'hidden'}}
    >
      <Spin tip="Loading..." spinning={loading}>
        <>
          {headerRecord && (
            <BaseFormOperatorTable
              cRef={childRef}
              funcCode={'D09F207_add'}
              toolBarRender={toolBarRender}
              initFormValues={headerRecord} // 初始化表单数据
              initDataSource={initDataSource} // 初始化表格数据
              formColumns={getFormColumns()}
              tableColumns={getTableColumns()}
              scroll={{y: 'calc(100vh - 440px)'}}
            />
          )}
        </>
      </Spin>
    </Modal>
  );
};

export default connect()(JiaPurchasePlanEdit);
