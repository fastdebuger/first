import React, { useEffect } from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { ErrorCode } from '@/common/const';
import { message, Select } from 'antd';
import DevList from "@/components/CommonList/DevList";
import { ConnectState } from "@/models/connect";
import ClsInfoList from '@/components/CommonList/ClsInfoList';

const { CrudAddModal } = SingleTable;

const { Option } = Select;
/**
 * @param props
 * @constructor
 */
const ClsConfigAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess, materialClsInfoList } = props;
  // console.log('materialClsInfoList :>> ', materialClsInfoList);
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
      dispatch({
        type: 'common/fetchDevList',
      });
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'material.dev_code',
          subTitle: '装置',
          dataIndex: 'dev_code',
          width: 160,
          align: 'center',
          renderSelfForm: (form) => {
            const onChange = (value: string) => {
              // form.setFieldsValue({
              //   dev_code: value,
              // });
            };
            return <DevList onChange={onChange} />;
          },
        },
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
        'allow_split_more',
        'allow_out_store_rate_more',
      ])
      .setFormColumnToInputNumber([
        { value: 'allow_split_more', min: 0, valueType: 'percent' },
        { value: 'allow_out_store_rate_more', min: 0, valueType: 'percent' }
      ])
      .needToRules(['dev_code', 'cls_code', 'allow_split_more', 'allow_out_store_rate_more'])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <CrudAddModal
      title={'新增物料分类配置信息'}
      visible={visible}
      onCancel={onCancel}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        Object.assign(values, {
          allow_in_store_rate_more: 0,
        })
        return new Promise((resolve) => {
          dispatch({
            type: 'materialclsconfig/addMaterialClsConfig',
            payload: values,
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('新增成功');
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
}))(ClsConfigAdd);
