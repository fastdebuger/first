import React, {useEffect, useRef, useState} from 'react';
import {BasicTableColumns, BasicFormColumns} from 'qcx4-components';
import {configColumns} from '../columns';
import {connect, useIntl} from 'umi';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import BaseFormDetailShow from '@/components/BaseFormDetailShow';
import {Button, InputNumber, Modal} from 'antd';
import VersionDrawer from '../version/versionDrawer'

const JiaPurchaseDetail: React.FC<any> = (props) => {
  const {dispatch, visible, onCancel, record, moduleCaption} = props;
  const {formatMessage} = useIntl();
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
  const childRef: any = useRef();
  const [versionRecord, setVersionRecord] = useState<any>({});
  const [versionVisible, setVersionVisible] = useState(false);
  const [headerRecord, setHeaderRecord] = useState<any>(null);
  useEffect(() => {
    dispatch({
      type: 'jiapurchaseplan/queryPurchasePlanHead',
      payload: {
        sort: 'form_no',
        order: 'asc',
        filter: JSON.stringify([{Key: 'form_no', Val: record.form_no, Operator: '='}]),
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
        'form_maker_name',
        'form_make_time',
        'modify_name',
        'modify_time',
        'status',
        'supply_type_str',
        'plan_materials_type_str',
        'warehouse_code_str',
        'warehouse_name_str',
        'remark',
      ])
      .setFormColumnToDatePicker([
        {value: 'form_date', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD'},
        {value: 'modify_time', valueType: 'dateTs', format: 'YYYY-MM-DD'},
      ]);
    return cols.getNeedColumns();
  };
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'prod_name',
        'cls_name',
        isShowNetAndMargin ? 'plan_net_num' : '',
        isShowNetAndMargin ? 'plan_margin_num' : '',
        'plan_num',
        'total_weight',
        'arrival_place',
        'demand_time_str',
        {
          title: '管线号',
          dataIndex: 'pipe_code',
          align: 'center',
          width: 260,
          render: (text: any, row: any) => {
            return (
              <span>
                {text}
                <a
                  style={{fontSize: 10, marginLeft: 4}}
                  onClick={() => {
                    setVersionRecord({...row, unit_code: record.unit_code});
                    setVersionVisible(true);
                  }}
                >
                  (版本)
                </a>
              </span>
            );
          },
        },
        'pipe_image_no',
        'pipe_section_code',
        'material',
        'spec',
        'unit',
        'unit_weight',
        'prod_describe',
        'auxiliary1_unit',
        'auxiliary1_num',
        'auxiliary2_unit',
        'auxiliary2_num',
        'version_code',
        'prod_memo',
      ])

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
  const toolBarRender = (selectedRows) => {
    return [
      <Button
        // style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        key={7}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, getTableColumns());
        }}
      >
        {formatMessage({id: 'common.export'})}
      </Button>,
      // <Button
      //   key={1}
      //   size="middle"
      //   type="primary"
      //   onClick={() => {
      //     //
      //   }}
      // >
      //   打印
      // </Button>,
    ];
  };
  return (
    <Modal
      title="需求计划详情"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={'100vw'}
      style={{top: 0, maxWidth: '100vw', padding: 0, overflowX: 'hidden'}}
      bodyStyle={{height: 'calc(100vh - 55px)', padding: 10, overflowX: 'hidden'}}
    >
      <div>
        {headerRecord && <BaseFormDetailShow columns={getFormColumns()} record={headerRecord}/>}
        <div style={{marginTop:10}}>
          <BaseFormSearchTable
            cRef={childRef}
            rowKey="prod_key"
            funcCode={'D09F207_detail'}
            tableSortOrder={{sort: 'prod_code', order: 'asc'}}
            tableDefaultField={{form_no: record.form_no}}
            formColumns={[]}
            tableColumns={getTableColumns()}
            type="jiapurchaseplan/queryPurchasePlanBody"
            exportType="jiapurchaseplan/queryPurchasePlanBody"
            toolBarRender={toolBarRender}
            operator={operator}
            moduleCaption={moduleCaption}
            rowSelection={undefined}
            sumCols={isShowNetAndMargin ?
              ['plan_net_num', 'plan_margin_num', 'plan_num', 'total_weight'] :
              ['plan_num', 'total_weight']
            }
            scroll={{y: 'calc(100vh - 450px)'}}
          />
        </div>
      </div>
      {versionVisible && versionRecord &&
      <VersionDrawer
        visible={versionVisible}
        selectedRecord={versionRecord}
        onCancel={() => setVersionVisible(false)}
      />}
    </Modal>
  );
};

export default connect()(JiaPurchaseDetail);
