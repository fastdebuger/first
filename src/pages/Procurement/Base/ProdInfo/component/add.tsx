import React, {useRef, useEffect} from 'react';
import {Button, Input, message, Modal, Select, Row,Col} from 'antd';
import {connect, useIntl} from 'umi';
import {CONST, ErrorCode} from '@/common/const';
import {BasicFormColumns} from 'qcx4-components';
import {configColumns} from '../columns';
import {ConnectState} from '@/models/connect';
import BaseTaskForm from "@/components/BaseTaskForm";
/**
 * 物料信息新增
 * @param props
 * @constructor
 */
const MatreialProdInfoPageAdd: React.FC<any> = (props) => {
  const {dispatch, materialClsInfoList, visible, onCancel,onSucess} = props;
  const {formatMessage} = useIntl();

  const getFormColumns = () => {
    const dnCol = new BasicFormColumns(configColumns);
    return (
      dnCol
        .initFormColumns([
          'prod_code',
          'prod_name',
          'aid_name',
          'cls_code',
          'spec',
          'unit',
          'prod_describe',
          'standard',
          'remark',
          'nps1',
          'nps2',
          'nps3',
          'material',
          'material_type',
          'unit_weight',
        ])
        .needToRules([ 'prod_code', 'prod_name', 'cls_code', 'spec', 'prod_describe', 'unit'])
        .setFormColumnToSelect([
          {
            value: 'cls_code',
            name: 'key',
            valueType: 'select',
            data: materialClsInfoList || [],
          },
        ]).setFormColumnToInputNumber([
        {value: 'nps1', min: 0, valueType: 'digit'},
        {value: 'nps2', min: 0, valueType: 'digit'},
        {value: 'nps3', min: 0, valueType: 'digit'},
        {value: 'unit_weight', min: 0, valueType: 'digit'},
      ])
        .getNeedColumns()
    );
  }

  const footerBarRender = (form: any) => {
    const handleAdd = async (files: any) => {
      files.preventDefault();
      const vals = await form.validateFields();
      console.log('--------------vals', vals)
      Object.assign(vals, {
        unit_weight: vals.unit_weight?Number(vals.unit_weight):0,
      });
      dispatch({
        type: 'matreialprodinfo/addMatreialProdInfo',
        payload: {
          ...vals,
          nps1: vals.nps1 || 0,
          nps2: vals.nps2 || 0,
          nps3: vals.nps3 || 0,
          dev_code: vals.dev_name
        },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({id: 'common.list.add.success'}));
            onSucess()
          }

        },
      });
    }
    return [
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={handleAdd}>
            提交
          </Button>
        </Col>
      </Row>
    ];
    };


  return (
    <Modal
      title='新增物料信息'
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={'100vw'}
      style={{top:0,maxWidth: "100vw",padding:0,overflowX:"hidden"}}
      bodyStyle={{height:"calc(100vh - 55px)",padding:10,overflowX:"hidden"}}
    >
      <BaseTaskForm
        formColumns={getFormColumns()}
        footerBarRender={footerBarRender}
        initialValue={{}}
      />
    </Modal>
  );
};

export default connect(({common, materialclsinfo}: ConnectState) => ({
  devList: common.devList,
  materialClsInfoList: materialclsinfo.materialClsInfoList,
}))(MatreialProdInfoPageAdd);
