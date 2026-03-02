import React, { useEffect } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { ErrorCode } from '@/common/const';
import { message, Select } from 'antd';
import type { ConnectState } from "@/models/connect";
import ClsInfoList from '@/components/CommonList/ClsInfoList';

const { CrudEditModal } = SingleTable;

/**
 * @param props
 * @constructor
 */
const ProdInfoEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess, selectedRecord, materialClsInfoList } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'materialclsinfo/getMaterialClsInfo',
        payload: {
          sort: 'cls_code',
          order: 'asc',
        },
      });
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'prod_code',
        'prod_name',
        'aid_name',
        {
          title: 'material.comp_type',
          subTitle: '编码库',
          dataIndex: 'comp_type',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            const onChange = (value: string) => {
              form.setFieldsValue({
                comp_type: value,
                cls_code: "",
              });
            };
            return (
              <ClsInfoList onChange={onChange} />
            )
          },
        },
        {
          title: formatMessage({ id: 'material.cls_code_show' }),
          subTitle: '',
          dataIndex: 'cls_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            const onChange = (value: string) => {
              form.setFieldsValue({
                cls_code: value,
              });
            };
            return (
              <Select
                placeholder="分类名称"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={onChange}
              >
                {materialClsInfoList &&
                  materialClsInfoList
                    .map((devItem: any) => {
                      return (
                        <Option key={devItem.cls_code} value={devItem.cls_code}>
                          {devItem.key}
                        </Option>
                      );
                    })}
              </Select>
            );
          }
        },
        'spec',
        'unit',
        'linear_meter',
        'prod_describe',
        'standard',
        'remark',
        'nps1',
        'nps2',
        'nps3',
        'material',
        'material_type',
        'unit_weight',
        'owner_prod_code',
        'owner_prod_describe'
      ])
      .setFormColumnToSelect([
        {
          value: 'cls_code',
          name: 'key',
          valueType: 'select',
          data: materialClsInfoList || [],
        },
      ]).setFormColumnToInputNumber([
        { value: 'nps1', min: 0, valueType: 'digit' },
        { value: 'nps2', min: 0, valueType: 'digit' },
        { value: 'nps3', min: 0, valueType: 'digit' },
        { value: 'unit_weight', min: 0, valueType: 'digit' },
        { value: 'linear_meter', min: 0, valueType: 'digit' },
      ])
      .needToDisabled(['prod_code'])
      .needToRules(['prod_code', 'prod_name', 'cls_code', 'spec', 'prod_describe', 'unit'])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <CrudEditModal
      title={'编辑物料信息'}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          Object.assign(values, {
            unit_weight: Number(values.unit_weight),
            linear_meter: values.linear_meter || 0,
          });
          dispatch({
            type: 'matreialprodinfo/updateMatreialProdInfo',
            payload: { ...selectedRecord, ...values },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                callbackAddSuccess();
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
}))(ProdInfoEdit);
