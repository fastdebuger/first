import React, { useRef, useState } from 'react';
import { connect, useIntl, history } from 'umi';
import { InputNumber, message, Modal, Spin } from 'antd';
import { BasicEditableColumns, BasicFormColumns } from 'qcx4-components';
import BaseFormOperatorTable from '@/components/BaseFormOperatorTable';
import { configColumns } from '../columns';
import { ErrorCode, PROP_KEY } from '@/common/const';
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
        // 'RowNumber',
        // 'form_no',
        // 'dep_code', //本地提交
        {
          title: 'PoPlanAll.dev_code',
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
          title: 'PoPlanAll.unit_project_code',
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
          title: 'PoPlanAll.unit_code',
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
                dispatch={dispatch}
                fieldNames={{ label: 'type_name', value: 'id' }}
                optionFilterProp={'type_name'}
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
        // 'cls_code',
        {
          title: '编码系统名称',
          subTitle: "编码系统名称",
          dataIndex: "cls_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'key', value: 'cls_code' }}
                optionFilterProp={'warehouse_name'}
                fetchType='materialclsinfo/getMaterialClsInfo'
                payload={{
                  sort: 'cls_code',
                  order: 'asc',
                }}
              />
            )
          }
        },
        'form_no_show',
        'po_price',
        'delivery_points',
        {
          title: 'PoPlanAll.user_code',
          subTitle: "现场接货人员",
          dataIndex: "user_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'user_name', value: 'user_code' }}
                optionFilterProp={'user_name'}
                fetchType='common/queryUserInfo'
                payload={{
                  sort: 'user_code',
                  order: 'desc',
                  filter: JSON.stringify([{
                    "Key": "other_account",
                    "Operator": "=",
                    "Val": "01"
                  }]),
                  prop_key: PROP_KEY
                }}
              />
            )
          }
        },
        'tel_num',

      ])
      .setFormColumnToInputNumber([
        {
          value: 'po_price',
          valueType: "digit"
        },
        {
          value: 'tel_num',
          valueType: "digit"
        }
      ])
      .needToRules([
        'dev_code',
        'unit_project_code',
        'unit_code',
        "supply_type",
        "warehouse_code",
        'cls_code',
        // 'form_no_show',
        'po_price',
        "user_code",
      ]);
    return cols.getNeedColumns();
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'prod_describe',
        'unit',
        'po_number',
        'plan_dep_code',
        'delivery_date',
        'purchase_group',
        'remark',
      ])
      .needToRules([
        'plan_num',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code'
      ]);

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
      title="采购计划新增"
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
          funcCode={'D09F207_add'}
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
