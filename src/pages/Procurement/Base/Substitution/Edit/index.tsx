import React from 'react';
import {configColumns} from '../columns';
import {BasicFormColumns, SingleTable} from 'yayang-ui';
import {useIntl} from 'umi';
import {connect} from 'dva';
import {ErrorCode} from '@/common/const';
import {message, Select} from 'antd';
import type {ConnectState} from "@/models/connect";

const {CrudEditModal} = SingleTable;
const {Option} = Select;
/**
 * @param props
 * @constructor
 */
const SubstitutionEdit: React.FC<any> = (props: any) => {
  const {dispatch, visible, onCancel, callbackAddSuccess, selectedRecord, matreialProdInfoList} = props;
  const {formatMessage} = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: formatMessage({id: 'material.ori_prod_code'}),
          subTitle: '',
          dataIndex: 'ori_prod_code',
          width: 200,
          align: 'center',
          renderSelfForm: (form) => {
            const onChange = (code: string) => {
              const describe: any = matreialProdInfoList.find((item: { prod_code: string; }) => item.prod_code === code)
              form.setFieldsValue({
                ori_prod_code: code,
                ori_prod_describe: describe.prod_describe
              });
            };
            return <Select
              placeholder="物料编码"
              allowClear
              showSearch
              onChange={onChange}
            >
              {matreialProdInfoList &&
              matreialProdInfoList
                .map((item: any) => {
                  return (
                    <Option key={item.prod_code} value={item.prod_code}>
                      {item.prod_code}
                    </Option>
                  );
                })}
            </Select>;
          },
        },
        'ori_prod_describe',
        {
          title: formatMessage({id: 'material.new_prod_code'}),
          dataIndex: 'new_prod_code',
          width: 200,
          align: 'center',
          subTitle: '',
          renderSelfForm: (form) => {
            const onChange = (code: string) => {
              const describe: any = matreialProdInfoList.find((item: { prod_code: string; }) => item.prod_code === code)
              form.setFieldsValue({
                new_prod_code: code,
                new_prod_describe: describe.prod_describe
              });
            };
            return <Select
              placeholder="物料编码"
              allowClear
              showSearch
              onChange={onChange}
            >
              {matreialProdInfoList &&
              matreialProdInfoList
                .map((item: any) => {
                  return (
                    <Option key={item.prod_code} value={item.prod_code}>
                      {item.prod_code}
                    </Option>
                  );
                })}
            </Select>;
          },
        },
        'new_prod_describe',
      ]).needToDisabled(['new_prod_describe', 'ori_prod_describe'])
      .needToRules(['ori_prod_code', 'new_prod_code'])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({id: item.title})));
    return cols;
  };

  return (
    <CrudEditModal
      title={'编辑物料代用信息'}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: 'matreialprodSubstitution/updateMaterialProdSubstituteInfo',
            payload: {...selectedRecord, ...values},
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

export default connect(({matreialprodinfo}: ConnectState) => ({
  matreialProdInfoList: matreialprodinfo.matreialProdInfoList,
}))(SubstitutionEdit);
