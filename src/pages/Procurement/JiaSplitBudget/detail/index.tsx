import React, { useEffect, useRef, useState } from 'react';
import { BasicEditableColumns, BasicFormColumns } from 'qcx4-components';
import { configColumns } from '../columns';
import { connect } from 'umi';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import BaseFormDetailShow from '@/components/BaseFormDetailShow';
import { Button, Modal } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { materialAllFlowReport } from "@/utils/utils";

/**
 * 甲供分割预算详情
 * @param props
 * @constructor
 */
const JIaSplitBudgetDetail: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, record, moduleCaption } = props;
  const childRef: any = useRef();
  const [headerRecord, setHeaderRecord] = useState<any>(null);
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
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
          setHeaderRecord(res.rows[0]);
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
        'obs_name',
        'status',
        'apprv_complete_ts',
        'form_maker_name',
        'form_make_time',
        'modify_name',
        'modify_time',
        'supply_type_str',
        'plan_materials_type_str',
        'warehouse_code_str',
        'warehouse_name_str',
        'remark',
      ])
      .setFormColumnToDatePicker([
        { value: 'form_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'modify_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'apprv_complete_ts', valueType: 'dateTs', format: 'YYYY-MM-DD' }
      ]);
    return cols.getNeedColumns();
  };
  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'prod_name',
        isShowNetAndMargin ? 'split_net_num' : "",
        isShowNetAndMargin ? 'split_margin_num' : "",
        'split_num',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'cls_name',
        'material',
        'unit',
        'spec',
        'anti_rank',
        'prod_describe',
        'prod_memo',
      ])
      .noNeedToEditable([])
      .needToRules([]);
    return cols.getNeedColumns();
  };
  // 定义过滤的条件
  const operator = {
    in: [],
    '=': ['form_no'],
    '>': [],
    '<': [],
    '><': [],
    noFilters: [],
  };
  const toolBarRender = () => {
    return [
      <Button
        key="1"
        size='middle'
        style={{ marginRight: 8 }}
        icon={<PrinterOutlined />}
        type="primary"
        onClick={() => {
          materialAllFlowReport(record.form_no, headerRecord.dev_code, 'JiaSplit.cpt');
        }}
      >
        打印
      </Button>,
      <Button
        icon={<DownloadOutlined />}
        type='primary'
        key={3}
        size='middle'
        onClick={() => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.exportFile();
          }
        }}
      >
        导出
      </Button>
    ];
  };
  return (
    <Modal
      title='分割预算详情'
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={'100vw'}
      style={{ top: 0, maxWidth: "100vw", padding: 0, overflowX: "hidden" }}
      bodyStyle={{ height: "calc(100vh - 55px)", padding: 10, overflowX: "hidden" }}
    >
      {headerRecord && <BaseFormDetailShow columns={getFormColumns()} record={headerRecord} />}
      <BaseFormSearchTable
        cRef={childRef}
        rowKey="RowNumber"
        funcCode={'D09F209_detail'}
        tableSortOrder={{ sort: 'form_no', order: 'asc' }}
        tableDefaultField={{ form_no: record.form_no }}
        formColumns={[]}
        moduleCaption={moduleCaption}
        tableColumns={getTableColumns()}
        type="jiasplitbudget/querySplitBudgetBody"
        exportType="jiasplitbudget/querySplitBudgetBody"
        toolBarRender={toolBarRender}
        operator={operator}
        rowSelection={undefined}
        sumCols={isShowNetAndMargin ?
          ['split_net_num', 'split_margin_num', 'split_num'] :
          ['split_num']
        }
        scroll={{ y: 'calc(100vh - 500px)' }}
      />
    </Modal>
  );
};

export default connect()(JIaSplitBudgetDetail);
