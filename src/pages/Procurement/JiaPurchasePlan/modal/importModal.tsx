import React, {useRef, useState} from 'react';
import {connect, useIntl} from 'umi';
import {Modal, message, Spin, InputNumber} from 'antd';
import {BasicEditableColumns} from 'qcx4-components';
import BaseFormOperatorTable from '@/components/BaseFormOperatorTable';
import {configColumns} from '../columns';
import {ErrorCode} from '@/common/const';
import {getTemplateCode} from "@/utils/authority";

/**
 * 修改甲供需求计划单
 * @param props
 * @constructor
 */
const JiaPurchasePlanEdit = (props: any) => {
  const {dispatch, visible, onCancel, onSucess, dataSource, authority} = props;
  const {formatMessage} = useIntl();
  const childRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns);
    cols
      .initTableColumns([
        'dev_name',
        'unit_project_name',
        'unit_name',

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
        'import_total_plan_num',
        'ori_plan_num',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_describe',
        'prod_memo',
      ])
      .setTableColumnToDatePicker([{value: 'demand_time', valueType: 'dateTs'}])
      .setTableColumnToInputNumber([
        {value: 'plan_num', valueType: 'digit'},
      ])
      .noNeedToEditable([
        'material',
        'prod_code',
        'cls_name',
        'prod_name',
        'spec',
        'unit',
        'prod_describe',
        'prod_memo',
        'import_total_plan_num',
        'ori_plan_num',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'dev_name',
        'unit_project_name',
        'unit_name',
        isShowNetAndMargin ? 'plan_num' : "",
      ])
      .needToRules([
        'plan_num',
        'dev_name',
        'unit_project_name',
        'unit_name',
        isShowNetAndMargin ? 'plan_net_num' : '',
        isShowNetAndMargin ? 'plan_margin_num' : '',

      ]);
    return cols.getNeedColumns();
  };


  /**
   * 点击提交后的执行的函数
   * @param fields
   */
  const callbackCommitData = async (fields: any) => {
    const {addItems, editItems} = fields;
    const arr = editItems.map((item: any) => (isShowNetAndMargin ? {
      tmp_id: item.tmp_id,
      plan_net_num: item.plan_net_num || 0,
      plan_margin_num: item.plan_margin_num || 0,
    } : {
      tmp_id: item.tmp_id,
      plan_num: item.plan_num,
      plan_net_num: 0,
      plan_margin_num: 0,
    }))
    setLoading(true)
    dispatch({
      type: 'jiapurchaseplan/modifyImportPurchasePlanVal',
      payload: {
        modifyItem: JSON.stringify(arr),
        tmp_tb: dataSource[0].tmp_tb,
        isShowNetAndMargin,
      },
      callback: (res: any) => {
        setLoading(false)
        childRef.current.cancelCommitButtonLoading();
        if (res.formNo) {
          message.success(formatMessage({id: 'common.list.edit.success'}));
          onSucess();
        }
      },
    });
  };
  return (
    <Modal
      title="需求计划数据管控"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={'80vw'}
      style={{top: 50, maxWidth: '100vw', padding: 0, overflowX: 'hidden'}}
      bodyStyle={{height: 'calc(80vh - 110px)', padding: 10, overflowX: 'hidden'}}
    >
      <Spin tip="Loading..." spinning={loading}>
        <>
          <BaseFormOperatorTable
            cRef={childRef}
            funcCode={'D09F207_import'}
            toolBarRender={() => []}
            initFormValues={{}} // 初始化表单数据
            initDataSource={dataSource} // 初始化表格数据
            formColumns={[]}
            callbackCommitData={callbackCommitData}
            tableColumns={getTableColumns()}
            scroll={{y: 'calc(80vh - 160px)'}}
          />
        </>
      </Spin>
    </Modal>
  );
};

export default connect()(JiaPurchasePlanEdit);
