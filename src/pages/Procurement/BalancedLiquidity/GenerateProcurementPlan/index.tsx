import React, { useEffect, useState } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, HeaderAndBodyTable, BasicEditableColumns } from 'yayang-ui';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { ErrorCode, PROP_KEY } from '@/common/const';
import { message, Space, Tag } from 'antd';
import DevList from "@/components/CommonList/DevList";
import { ConnectState } from "@/models/connect";
import UnitList from '@/components/CommonList/UnitList';
import UnitProjectList from '@/components/CommonList/UnitProjectList';
import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';
import useSysDict from '@/utils/useSysDict';

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * @param props
 * @constructor
 */
const GenerateProcurementPlan: React.FC<any> = (props: any) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess,
    selectedRecord,
  } = props;

  const initDataSource = selectedRecord?.map(o => ({
    ...o,
    plan_form_no: o.form_no,
    plan_form_no_show: o.form_no_show,
  })) || []

  const { formatMessage } = useIntl();
  const [purchaseGroup, setPurchaseGroup] = useState(null)

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'materialclsinfo/getMaterialClsInfo',
        payload: {
          sort: 'cls_code',
          order: 'asc',
        },
      });
      dispatch({
        type: 'common/fetchDevList',
      });

      dispatch({
        type: "purchase/getPurchaseGroup",
        payload: {
          filter: JSON.stringify([]),
          order: 'desc',
          sort: 'id',
        },
        callback: (res: { errCode: number; rows: any }) => {
          if (res.errCode === ErrorCode.ErrOk) {
            const flatData = res.rows;
            setPurchaseGroup(flatData)
          } else {
            setPurchaseGroup(null);
          }
        },
      });
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // "plan_form_no",
        "form_date",
         {
          title: '总体采购策略',
          subTitle: "总体采购策略",
          dataIndex: "purchase_strategy_no",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                isExpand={false}
                fieldNames={{ label: 'purchase_strategy_no', value: 'form_no' }}
                optionFilterProp={'dict_name'}
                fetchType='purchaseStrategy/getMaterialsPurchaseStrategy'
                payload={{
                  sort: 'form_no',
                  order: 'asc',
                  filter: JSON.stringify([]),
                }}
              />
            )
          }
        },
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
        // "purchase_strategy_no",
        "po_price",
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
                  filter: JSON.stringify([{
                    "Key": "sys_type_code",
                    "Operator": "=",
                    "Val": "SUPPLY_TYPE"
                  }]),
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
        "delivery_points",
        {
          title: 'material.user_code_delivery',
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
      ])
      .setFormColumnToDatePicker([
        {
          value: 'form_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        }
      ])
      // .setFormColumnToSelect([
      //   {
      //     value: 'supply_type',
      //     name: 'dict_name',
      //     valueType: 'select',
      //     data: configData?.SUPPLY_TYPE || [],
      //     valueAlias: 'id',
      //   },
      // ])
      .setFormColumnToInputNumber([
        {
          value: "po_price",
          valueType: "digit"
        }
      ])
      .needToRules([
        'dev_code',
        'cls_code',
        "purchase_strategy_no",
        'allow_split_more',
        'allow_out_store_rate_more'
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  // 表格配置
  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        "plan_form_no_show",
        "po_number",
        "balance_number",
        "purchase_group",
        "prod_code",
      ])
      // .setTableColumnToSpecialInput([
      //   {
      //     value: "prod_code",
      //     valueType: "specialInput"
      //   }
      // ])
      .setTableColumnToSelect([
        {
          value: 'purchase_group',//采购组选择
          name: 'purchase_group_name',
          valueAlias: 'id',
          valueType: 'select',
          data: purchaseGroup || []
        },
      ])
      .setTableColumnToInputNumber([
        {
          value: "po_number",
          valueType: "digit"
        },
        {
          value: "balance_number",
          valueType: "digit"
        }
      ])
      .noNeedToEditable([
        "plan_form_no_show",
        "prod_code"
      ])
      .getNeedColumns();

    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const toolBarRender = (
    handleAdd: any,
    handleBatchAdd: any,
    form: any,
    updateLoadDataSourc: any,
    dataSource: any
  ) => {
    return [
      <Space>
        <h3>采购计划内容</h3>
      </Space>
    ]
  }

  return (
    <CrudEditModal
      title={'生成采购计划'}
      visible={visible}
      onCancel={onCancel}
      // initialValue={selectedRecord}
      // columns={getFormColumns()}
      toolBarRender={toolBarRender}
      formColumns={getFormColumns()}
      tableColumns={getTableColumns()}
      initFormValues={undefined}
      initDataSource={[...initDataSource]}
      onCommit={(data: any) => {
        const { dataSource, form } = data;
        const values = form.getFieldsValue();
        if (!(dataSource.length > 0)) {
          message.error("请添加数据")
          return new Promise((resolve: any) => {
            resolve(true)
          })
        }
        const datas = dataSource
          .map((i: any) => {
            delete i.id;
            delete i.key;
            delete i.isEditRow;
            delete i.isAddRow;
            delete i.RowNumber;
            return i;
          })
        // console.log('datas :>> ', datas);
        // return new Promise((a) => a(true))
        return new Promise((resolve: any) => {
          dispatch({
            type: 'balancedLiquidity/addBalanceInventory',
            payload: {
              ...values,
              // wbs: localStorage.getItem("auth-default-wbsCode"),
              Items: JSON.stringify(
                datas
              ),
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('生成采购计划成功');
                setTimeout(() => {
                  callbackAddSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect(({ common, materialclsinfo }: ConnectState) => ({
  devList: common.devList,
  materialClsInfoList: materialclsinfo.materialClsInfoListFilter,
}))(GenerateProcurementPlan);
