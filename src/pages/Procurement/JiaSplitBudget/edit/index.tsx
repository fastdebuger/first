import React, { useEffect, useRef, useState } from 'react';
import { connect, useIntl } from 'umi';
import { message, Modal, InputNumber, Spin } from 'antd';
import { BasicEditableColumns, BasicFormColumns } from 'qcx4-components';
import BaseFormOperatorTable from '@/components/BaseFormOperatorTable';
import { configColumns } from '../columns';
import { ErrorCode } from '@/common/const';
import FormBakDataModal from '../modal';
import DevList from '@/components/CommonList/DevList';
import UnitProjectList from '@/components/CommonList/UnitProjectList';
import UnitList from '@/components/CommonList/UnitList';
import ObsList from '@/components/CommonList/ObsList';
import {
  getAllowMoreNum,
} from '@/utils/utils';
import { ConnectState } from '@/models/connect';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';

/**
 * 修改甲供分割预算
 * @param props
 * @constructor
 */
const JIaSplitBudgetEdit = (props: any) => {
  const {
    visible,
    onCancel, onSucess, record,
    dispatch,
    materialClsConfigList,
  } = props;
  const { formatMessage } = useIntl();
  const childRef: any = useRef();
  const [initDataSource, setInitDataSource] = useState([]);
  const [headerRecord, setHeaderRecord] = useState<any>(null);
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
  useEffect(() => {
    dispatch({
      type: 'jiasplitbudget/querySplitBudgetHead',
      payload: {
        sort: 'form_no',
        order: 'asc',
        filter: JSON.stringify([{ Key: 'form_no', Val: record.form_no, Operator: '=' }]),
      },
      callback: (res: any) => {
        if (res && res.rows && res.rows.length > 0) {
          Object.assign(res.rows[0], {
            dev_code: {
              key: res.rows[0].dev_code,
              value: res.rows[0].dev_code,
              label: res.rows[0].dev_name,
            },
            unit_project_code: {
              key: res.rows[0].unit_project_code,
              value: res.rows[0].unit_project_code,
              label: res.rows[0].unit_project_name,
            },
            unit_code: {
              key: res.rows[0].unit_code,
              value: res.rows[0].unit_code,
              label: res.rows[0].unit_name,
            },
          });
          setHeaderRecord(res.rows[0]);
        }
      },
    });
  }, []);
  useEffect(() => {
    dispatch({
      type: 'jiasplitbudget/querySplitBudgetBody',
      payload: {
        sort: 'form_no',
        order: 'asc',
        filter: JSON.stringify([{ Key: 'form_no', Val: record.form_no, Operator: '=' }]),
      },
      callback: (res) => {
        if (res.rows && res.rows.length > 0) {
          res.rows.forEach((row: any) => {
            Object.assign(row, {
              computed_split_num: row.split_num, // 用于计算的分割量
              total_split_num: row.total_split_num, // 总分割量
              total_plan_num: row.total_plan_num, // 总计划量
              allow_split_more: getAllowMoreNum(materialClsConfigList, row, 'allow_split_more'), // 允许分割超计划量
            });
          });
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
            return <DevList disabled labelInValue onChange={onChange} />;
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
            return <UnitProjectList disabled={true} labelInValue onChange={onChange} />;
          },
        },
        {
          title: 'material.unit_code',
          subTitle: '单元编码',
          dataIndex: 'unit_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            return <UnitList disabled={true} labelInValue />;
          },
        },
        {
          title: 'material.obs_code',
          subTitle: '分包队伍编码',
          dataIndex: 'obs_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            return <ObsList disabled={true} />;
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
                dispatch={dispatch}
                isExpand={false}
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
                isExpand={false}
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
                isExpand={false}
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
      .needToRules(['form_date', 'dev_code', 'unit_code', 'unit_project_code', 'obs_code', 'supply_type', 'plan_materials_type', 'warehouse_code']);
    return cols.getNeedColumns();
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'anti_rank',
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
            const onChange = (value: string) => {
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
        'cls_name',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_name',
        'prod_describe',
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
        'prod_name',
        'pipe_code',
        'cls_name',
        'pipe_image_no',
        'pipe_section_code',
        'spec',
        'unit',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_describe',
        'rest_plan_num',
        'material',
        'total_split_num',
        'total_plan_num',
        isShowNetAndMargin ? 'split_num' : ''
      ])
      .needToRules([
        isShowNetAndMargin ? 'split_net_num' : "",
        isShowNetAndMargin ? 'split_margin_num' : "",
        'split_num', 'pipe_code',
        'pipe_image_no',
        'pipe_section_code',]);
    return cols.getNeedColumns();
  };

  const toolBarRender = (handleAdd, handleBatchAdd, form) => {
    return [
      <FormBakDataModal
        form={form}
        onOk={(selectedRows: any) => {
          selectedRows.forEach((row: any) => {
            Object.assign(row, {
              uniqueKey: `${row.prod_code}-${row.pipe_code}`,
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
    const { addItems, editItems, delItems, dataSource, form } = fields;
    const values = await form.validateFields();
    addItems.forEach((item: any) => {
      Object.assign(item, {
        split_net_num: item.split_net_num || 0,
        split_margin_num: item.split_margin_num || 0,
      })
    })
    editItems.forEach((item: any) => {
      Object.assign(item, {
        split_net_num: item.split_net_num || 0,
        split_margin_num: item.split_margin_num || 0,
      })
    })
    setLoading(true)
    dispatch({
      type: 'jiasplitbudget/updateSplitBudget',
      payload: {
        // form_no: record.form_no,
        // form_no_show: values.form_no_show,
        // form_date: values.form_date,
        // dev_code: values.dev_code.value,
        // unit_project_code: values.unit_project_code.value,
        // unit_code: values.unit_code.value,
        // obs_code: values.obs_code,
        // remark: values.remark,
        // approval_status: record.approval_status || '',
        // ...record,
        form_no: record.form_no,
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
        // "form_no": values.form_no,
        AddItems: JSON.stringify(addItems),
        UpdateItems: JSON.stringify(editItems),
        DelItems: JSON.stringify(delItems && delItems.length > 0 ? delItems.map((item: { prod_key: any; }) => item.prod_key) : [])
      },
      callback: (res: any) => {
        setLoading(false)
        childRef.current.cancelCommitButtonLoading();
        if (res.errCode === ErrorCode.ErrOk) {
          message.success(formatMessage({ id: 'common.list.edit.success' }));
          onSucess()
        }
      },
    });
  };

  return (
    <Modal
      title='分割预算编辑'
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
        {headerRecord && (
          <BaseFormOperatorTable
            cRef={childRef}
            funcCode={'D09F504_add'}
            toolBarRender={toolBarRender}
            initFormValues={headerRecord} // 初始化表单数据
            initDataSource={initDataSource} // 初始化表格数据
            formColumns={getFormColumns()}
            tableColumns={getTableColumns()}
            //callbackCommitData={callbackCommitData}
            scroll={{ y: 'calc(100vh - 520px)' }}
          />
        )}
      </Spin>
    </Modal>
  );
};

export default connect(({ materialclsconfig }: ConnectState) => ({
  materialClsConfigList: materialclsconfig.materialClsConfigList,
}))(JIaSplitBudgetEdit);
