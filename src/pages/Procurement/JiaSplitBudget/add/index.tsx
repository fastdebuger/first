import React, { useEffect, useRef, useState } from 'react';
import { connect, useIntl } from 'umi';
import { Spin, message, InputNumber, Modal } from 'antd';
import { BasicEditableColumns, BasicFormColumns } from 'qcx4-components';
import BaseFormOperatorTable from '@/components/BaseFormOperatorTable';
import { configColumns } from '../columns';
import { ErrorCode } from '@/common/const';
import FormBakDataModal from '../modal';
import DevList from '@/components/CommonList/DevList';
import UnitProjectList from '@/components/CommonList/UnitProjectList';
import UnitList from '@/components/CommonList/UnitList';
import ObsList from '@/components/CommonList/ObsList';
import { getAllowMoreNum } from '@/utils/utils';
import type { ConnectState } from '@/models/connect';
import { getTS } from "@/utils/utils-date";
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';

/**
 * 新增甲供分割预算
 * @param props
 * @constructor
 */
const JIaSplitBudgetAdds = (props: any) => {
  const { dispatch, visible, onCancel, onSucess, materialClsConfigList } = props;
  const { formatMessage } = useIntl();
  const childRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'

  // 查询物料分类配置 得到分割超计划比例
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'materialclsconfig/getMaterialClsConfig',
        payload: {
          sort: 'cls_code',
          order: 'asc',
        },
      });
    }
  }, []);

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
          renderSelfForm: (form, dataSource, updateDataSource) => {
            const onChange = (value: string) => {
              form.current.setFieldsValue({
                dev_code: value,
                unit_project_code: '',
                unit_code: '',
                form_no: undefined,
              });
              if (updateDataSource) {
                updateDataSource([])
              }
            };
            return <DevList labelInValue onChange={onChange} />;
          },
        },
        {
          title: 'material.unit_project_code',
          subTitle: '单位工程编码',
          dataIndex: 'unit_project_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form, dataSource, updateDataSource) => {
            const onChange = (value: string) => {
              form.current.setFieldsValue({
                unit_project_code: value,
                unit_code: '',
                form_no: undefined,
              });
              if (updateDataSource) {
                updateDataSource([])
              }
            };
            return <UnitProjectList labelInValue onChange={onChange} />;
          },
        },
        {
          title: 'material.unit_code',
          subTitle: '单元编码',
          dataIndex: 'unit_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form, dataSource, updateDataSource) => {
            const onChange = (value: string | null) => {
              form.current.setFieldsValue({
                unit_code: value,
                form_no: undefined,
              });
            };
            const initTableSource = () => {
              if (updateDataSource) {
                updateDataSource([])
              }
            }
            return <UnitList labelInValue onChange={onChange} initTableSource={initTableSource} />;
          },
        },
        {
          title: 'material.obs_code',
          subTitle: '分包队伍编码',
          dataIndex: 'obs_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form, dataSource, updateDataSource) => {
            const initTableSource = () => {
              if (updateDataSource) {
                updateDataSource([])
              }
            }
            return <ObsList initTableSource={initTableSource} />;
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
        {
          title: '需求计划',
          subTitle: "需求计划",
          dataIndex: "form_no",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            // 监听 dev_code, unit_project_code, unit_code 的变化
            const devCode = form.current?.getFieldValue('dev_code')?.value || '';
            const unitProjectCode = form.current?.getFieldValue('unit_project_code')?.value || '';
            const unitCode = form.current?.getFieldValue('unit_code')?.value || '';
            return (
              <CommonPaginationSelect
                isExpand={false}
                dispatch={dispatch}
                fieldNames={{ label: 'form_no_show', value: 'form_no' }}
                optionFilterProp={'form_no_show'}
                fetchType='jiapurchaseplan/queryPurchasePlanHead'
                payload={{
                  sort: 'modify_time',
                  order: 'desc',
                  filter: JSON.stringify([
                    { "Key": "dev_code", "Operator": "=", "Val": devCode },
                    { "Key": "unit_project_code", "Operator": "=", "Val": unitProjectCode },
                    { "Key": "unit_code", "Operator": "=", "Val": unitCode }
                  ]),
                }}
              />
            )
          }
        },
        'remark',
      ])
      .setFormColumnToDatePicker([{ value: 'form_date', valueType: 'dateTs' }])
      .needToRules(['form_date', 'dev_code', 'unit_project_code', 'unit_code', 'obs_code', 'supply_type', 'plan_materials_type', 'warehouse_code', 'form_no']);
    return cols.getNeedColumns();
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'anti_rank',
        'cls_name',
        'rest_plan_num',
        'allow_split_more',
        isShowNetAndMargin ? {
          title: '图纸净量',
          dataIndex: 'split_net_num',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = e.target.value
              const num2 = record.split_margin_num || 0
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                split_net_num: num,
                split_num: Number(num) + Number(num2)
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} />
          },
        } : '',
        isShowNetAndMargin ? {
          title: '图纸裕量',
          dataIndex: 'split_margin_num',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record: any, handleSave: any) => {
            const onBlur = (e: any) => {
              const num = e.target.value
              const num2 = record.split_net_num || 0
              const copyRecord = { ...record };
              Object.assign(copyRecord, {
                split_margin_num: num,
                split_num: Number(num) + Number(num2)
              });
              handleSave(copyRecord);
            };
            return <InputNumber onBlur={onBlur} />
          },
        } : '',
        isShowNetAndMargin ? 'split_num' : {
          title: 'material.split_num',
          dataIndex: 'split_num',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (_record, handleSave, headerForm, onBlurSave, dataSource) => {
            const onChange = (value: any) => {
              const copyRecord = { ..._record };
              Object.assign(copyRecord, {
                split_num: value,
              });
              handleSave(copyRecord);
            };
            return (
              <InputNumber
                value={_record.split_num}
                onChange={onChange}
              />
            );
          },
        },
        'total_split_num',
        'total_plan_num',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_name',
        'prod_describe',
        'cls_name',
        'material',
        'unit',
        'spec',
        'prod_memo',
      ])
      .setEditTableHeaderTitleBatchIconToInput([
        { value: 'anti_rank', showTableColumns: ['prod_code', 'anti_rank'] },
        { value: 'prod_memo', showTableColumns: ['prod_code', 'prod_memo'] },
      ])
      .noNeedToEditable([
        'prod_code',
        'cls_name',
        'allow_split_more',
        'prod_name',
        'spec',
        'unit',
        'cls_name',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_describe',
        'rest_plan_num',
        'total_split_num',
        'total_plan_num',
        'material',
        isShowNetAndMargin ? 'split_num' : ''
      ])
      .needToRules(['pipe_code',
        'pipe_image_no',
        isShowNetAndMargin ? 'split_net_num' : "",
        isShowNetAndMargin ? 'split_margin_num' : "",
        'pipe_section_code', 'split_num']);
    return cols.getNeedColumns();
  };

  const toolBarRender = (handleAdd, handleBatchAdd, form) => {
    const formNo = form.current?.getFieldValue('form_no')?.value
    return [
      <FormBakDataModal
        form={form}
        formNo={formNo}
        onOk={(selectedRows: any) => {
          selectedRows.forEach((row: any) => {
            Object.assign(row, {
              computed_split_num: 0,
              split_num: 0,
              allow_split_more: getAllowMoreNum(materialClsConfigList, row, 'allow_split_more'),
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
    const { addItems, dataSource, form } = fields;
    const values = await form.validateFields();
    // console.log('values :>> ', values);
    addItems.forEach((item: any) => {
      Object.assign(item, {
        split_net_num: item.split_net_num || 0,
        split_margin_num: item.split_margin_num || 0,
      })
    })
    // setLoading(true)
    childRef.current.handleSaveDataSource(dataSource)
    dispatch({
      type: 'jiasplitbudget/addSplitBudget',
      payload: {
        // ...values,
        dev_code: values.dev_code.value,
        unit_project_code: values.unit_project_code.value,
        unit_code: values.unit_code.value,
        form_no_show: values.form_no_show,

        form_date: values.form_date,
        obs_code: values.obs_code,
        remark: values.remark,
        "supply_type": values.supply_type,
        "plan_materials_type": values.plan_materials_type,
        "warehouse_code": values.warehouse_code,
        "form_no": values.form_no,
        Items: JSON.stringify(addItems),
      },
      callback: (res: any) => {
        // setLoading(false)
        childRef.current.handleSaveDataSource(dataSource)
        if (res.errCode === ErrorCode.ErrOk) {
          message.success(formatMessage({ id: 'common.list.add.success' }));
          onSucess()
        }
      },
    });
  };

  return (
    <Modal
      title='分割预算新增'
      visible={visible}
      onCancel={onCancel}
      onOk={async () => {
        const res = await childRef.current.getCommitData();
        callbackCommitData(res);
      }}
      width={'100vw'}
      style={{ top: 0, maxWidth: "100vw", padding: 0, overflowX: "hidden" }}
      bodyStyle={{ height: "calc(100vh - 110px)", padding: 10, overflowX: "hidden" }}
    >
      <Spin tip='Loading...' spinning={loading}>
        <BaseFormOperatorTable
          cRef={childRef}
          funcCode={'D09F504_add'}
          toolBarRender={toolBarRender}
          initFormValues={{ form_date: getTS() }} // 初始化表单数据
          initDataSource={[]} // 初始化表格数据
          formColumns={getFormColumns()}
          tableColumns={getTableColumns()}
          //callbackCommitData={callbackCommitData}
          scroll={{ y: 'calc(100vh - 520px)' }}
        />
      </Spin>
    </Modal>
  );
};

export default connect(({ materialclsconfig }: ConnectState) => ({
  materialClsConfigList: materialclsconfig.materialClsConfigList,
}))(JIaSplitBudgetAdds);
