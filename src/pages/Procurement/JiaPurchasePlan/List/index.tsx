import React, { useEffect, useRef, useState } from 'react';
import { connect, useIntl } from 'umi';
import { hasPermission, getTemplateCode } from '@/utils/authority';
import { Button, message, Modal, Tag, Upload } from 'antd';
import { BasicTableColumns } from 'qcx4-components';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import { CONST } from '@/common/const';
import { configColumns } from '../columns';
import AddModal from '../add/index';
import DetailModal from '../detail/index';
import EditModal from '../edit/index';
import { FuncCode } from '@/common/const';
import VersionModal from '@/components/VersionModal';
import VersionModalNew from '../version';
import ImportModal from '../modal/importModal';
const { confirm } = Modal;
/**
 * 甲供需求计划单
 * @param props
 * @constructor
 */
const JiaPurchasePlanPage: React.FC<any> = (props: any) => {
  const { dispatch, moduleCaption, authority } = props;
  const isApproval = localStorage.getItem('system-is-open-approval') === '1';

  const childRef: any = useRef();
  const { formatMessage } = useIntl();
  const [templateStatus, setTemplateStatus] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditlVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [record, setRecord] = useState<any>({});
  const [versionVisible, setVersionVisible] = useState(false);
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
  const importPurchasePlanByInteraction = localStorage.getItem('system-importPurchasePlanByInteraction') === 'true'
  const minLevel = localStorage.getItem('system-min-level-module-config')
  const [dataSource, setDataSource] = useState([])
  const [versionVisibleNew, setVersionVisibleNew] = useState(false)
  const [templateCode, setTemplateCode] = useState('');
  const [isCompanyAllowApproval, setIsCompanyAllowApproval] = useState(false);

  const importInteraction = (res: any) => {
    if (res && res.rows && res.errCode === 0) {
      setDataSource(res.rows)
      setImportVisible(true)
    }
  }


  useEffect(() => {
    dispatch({
      type: 'processTemplate/queryProcessFuncCodeTemplate',
      payload: {
        sort: 'template_code',
        order: 'asc',
      },
      callback: (res: any) => {
        console.log(res);
        if (res && res.rows) {
          const tar: any[] = [];
          res.rows.forEach((it: any) => {
            if (it.func_code === FuncCode.PURCHASE_PLAN && it.template_name) {
              tar.push(it);
            }
          });
          console.log(tar);
          if (tar.length > 0) {
            setTemplateCode(tar[0].template_code)
            setTemplateStatus(true);
          }
        }
      },
    });
  }, []);

  /**
   * 删除
   * @param fields
   */
  const handleDelete = (fieldsArray: any) => {
    const fields = fieldsArray[0]
    confirm({
      title: formatMessage({ id: 'common.ordelete' }),
      okText: formatMessage({ id: 'common.delete' }),
      cancelText: formatMessage({ id: 'common.cancel' }),
      onOk() {
        dispatch({
          type: 'jiapurchaseplan/delPurchasePlan',
          payload: {
            form_no: fields.form_no || '',
            dev_code: fields.dev_code || '',
          },
          callback: (res: any) => {
            if (res.errCode === 0) {
              message.success(formatMessage({ id: 'common.delete.successMsg' }));
              if (childRef.current) {
                childRef.current.reloadTable();
              }
            }
          },
        });
      },
    });
  };
  // 获取表格配置
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        {
          title: 'material.form_no_show',
          dataIndex: 'form_no_show',
          align: 'center',
          width: 160,
          render: (text: any, row: any) => {
            let name = text;
            if (name === '' || name === null) name = '-';
            return (
              <span>
                <a
                  onClick={() => {
                    setRecord(row);
                    setDetailVisible(true);
                  }}
                >
                  {name}
                </a>
                {row.data_source === 'meter' && <Tag style={{ marginLeft: 4 }} color={"gold"} >仪表</Tag>}
                {row.data_source === 'electric' && <Tag style={{ marginLeft: 4 }} color={'volcano'} >电气</Tag>}
                {row.data_source === 'steel' && <Tag style={{ marginLeft: 4 }} color={'blue'} >钢结构</Tag>}
              </span>
            );
          }
        },
        'form_date_format',
        'dev_name',
        'unit_project_name',
        // 'unit_name',
        {
          title: 'material.unit_name',
          dataIndex: 'unit_name',
          align: 'center',
          width: 160,
          render: (text: any, row: any) => {
            return (
              <span>
                {text}
                <a
                  style={{ fontSize: 10, marginLeft: 4 }}
                  onClick={() => {
                    setRecord(row);
                    setVersionVisible(true);
                  }}
                >
                  (修改记录)
                </a>
              </span>
            );
          },
        },
        (isApproval || isCompanyAllowApproval) ? 'status_str' : '',
        'supply_type_str',
        'plan_materials_type_str',
        'warehouse_code_str',
        'warehouse_name_str',
        'form_maker_name',
        'form_make_time_format',
        'modify_name',
        'modify_time_format',
        'remark',
      ])
    return cols.getNeedColumns();
  };
  // 定义按钮
  const toolBarRender = (selectedRows: any) => {
    return [
      <Button
        key={1}
        // style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
        size="middle"
        type="primary"
        onClick={() => {
          setAddVisible(true);
        }}
      >
        {formatMessage({ id: 'common.add' })}
      </Button>,
      <Button
        key={2}
        // style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        size="middle"
        type="primary"
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning(formatMessage({ id: 'common.selected.row.is.one' }));
            return;
          }
          const isApprovalSelf = localStorage.getItem('system-is_open_approval_self') === '1';
          const userCode = localStorage.getItem('auth-default-userCode')
          if (isApprovalSelf && userCode !== selectedRows[0].form_maker_code) {
            message.warning('仅支持本人修改单据数据')
            return;
          }
          setEditlVisible(true);
          setRecord(selectedRows[0]);
        }}
      >
        {formatMessage({ id: 'common.edit' })}
      </Button>,
      <Button
        key={3}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        size="middle"
        type="primary"
        danger
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning(formatMessage({ id: 'common.selected.row.is.one' }));
            return;
          }

          handleDelete(selectedRows);

        }}
      >
        {formatMessage({ id: 'common.delete' })}
      </Button>,
      <Button
        type="primary"
        size="middle"
        style={{ display: hasPermission(authority, '需求计划单模版') ? 'inline' : 'none' }}
        onClick={() => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.downloadImportFile(isShowNetAndMargin ? `${getTemplateCode(authority, '需求计划单模版')}_1` : getTemplateCode(authority, '需求计划单模版'));
          }
        }}
      >
        {formatMessage({ id: 'common.list.template' })}
      </Button>,
      <Upload
        key={4}
        showUploadList={false}
        name="file"
        accept={CONST.IMPORT_FILE_TYPE}
        beforeUpload={(file) => {
          childRef.current.importFile(
            file,
            isShowNetAndMargin ? `${getTemplateCode(authority, '需求计划单模版')}_1` : getTemplateCode(authority, '需求计划单模版'),
            importPurchasePlanByInteraction ? importInteraction : undefined,
          );
        }}
      >
        <Button
          key={5}
          style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
          size="middle"
          type="primary"
        >
          {formatMessage({ id: 'common.import' })}
        </Button>
      </Upload>,
      <Button
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        key={7}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, getTableColumns());
        }}
      >
        {formatMessage({ id: 'common.export' })}
      </Button>,
      hasPermission(authority, '打印') && <Button
        key={5}
        size="middle"
        type="primary"
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning(formatMessage({ id: 'common.selected.row.is.one' }));
            return;
          }
          const currDepCode = localStorage.getItem('auth-default-cpecc-currDepCode')
          const depCode = localStorage.getItem('auth-default-cpecc-depCode')
          const formNos = selectedRows[0].form_no
          const url = `${CONST.HOST_RPT}?reportlet=Materials2.0/jiaDemandPlan.cpt&op=write&currDepCode=${currDepCode}&depCode=${depCode}&form_no=${formNos}&dev_code=${selectedRows[0].dev_code}`
          window.open(url)
        }}
      >
        打印
      </Button>,
    ];
  };

  const selectedRowsToolbar = (rows: any) => {
    return []
  }

  const addModalSucess = () => {
    setAddVisible(false);
    setEditlVisible(false);
    if (childRef.current) {
      // @ts-ignore
      childRef.current.reloadTable();
    }
  };

  // 定义过滤的条件
  const operator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': [],
    noFilters: [],
  };

  // 获取表格配置
  const getVersionTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_code',
        'plan_num',
        'total_weight',
        'arrival_place',
        'demand_time',
        'demand_time_str',
        'prod_name',
        'info_cls_name',
        'material',
        'spec',
        'unit',
        'unit_weight',
        'prod_describe',
        'auxiliary1_unit',
        'auxiliary1_num',
        'auxiliary2_unit',
        'auxiliary2_num',
        'prod_memo',
      ])
    return cols.getNeedColumns();
  };

  // 获取表格配置
  const getCompareVersionTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'prod_code',
        'prod_name',
        'plan_num_version1',
        'plan_num_version2',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'total_weight',
        'arrival_place',
        'info_cls_name',
        'material',
        'spec',
        'unit',
        'unit_weight',
        'prod_describe',
        'prod_memo',
      ])
    return cols.getNeedColumns();
  };

  return (
    <div style={{ backgroundColor: '#fff', marginTop: -16 }}>
      <BaseFormSearchTable
        cRef={childRef}
        selectedRowsToolbar={selectedRowsToolbar}
        moduleCaption={moduleCaption}
        rowKey="form_no"
        funcCode={authority + '需求计划'}
        tableSortOrder={{ sort: 'form_no', order: 'desc' }}
        formColumns={[]}
        tableColumns={getTableColumns()}
        type="jiapurchaseplan/queryPurchasePlanHead"
        importType={minLevel !== 'unit_code' && importPurchasePlanByInteraction ?
          "jiapurchaseplan/importPurchasePlanByInteraction" :
          "jiapurchaseplan/import"
        }
        exportType="jiapurchaseplan/queryPurchasePlanHead"
        toolBarRender={toolBarRender}
        dateCols={['form_date', 'apprv_complete_ts', 'form_make_time', 'modify_time']}
        operator={operator}
        identityCols={['form_no_show']}
        rowSelection={{
          type: 'checkbox',
        }}
      />
      {addVisible && (
        <AddModal
          visible={addVisible}
          onSucess={addModalSucess}
          onCancel={() => setAddVisible(false)}
        />
      )}
      {detailVisible && (
        <DetailModal
          visible={detailVisible}
          record={record}
          moduleCaption={`${moduleCaption}详情`}
          onCancel={() => setDetailVisible(false)}
        />
      )}
      {editVisible && (
        <EditModal
          visible={editVisible}
          record={record}
          onSucess={addModalSucess}
          onCancel={() => setEditlVisible(false)}
        />
      )}
      {versionVisible && (
        <VersionModal
          header={{
            type: 'jiapurchaseplan/queryPurchasePlanVersionHead',
            payload: {
              sort: 'version_code',
              order: 'desc',
              filter: JSON.stringify([
                { Key: 'unit_code', Val: record.unit_code, Operator: '=' }
              ])
            }
          }}
          body={{
            type: "jiapurchaseplan/queryPurchasePlanVersionBody",
            payload: {
              sort: 'prod_key',
              order: 'asc'
            },
            columns: getVersionTableColumns(),
          }}
          result={{
            type: 'jiapurchaseplan/comparePurchasePlanVersionData',
            payload: { sort: 'prod_code', order: 'asc' },
            columns: getCompareVersionTableColumns()
          }}
          selectedRecord={record}
          visible={versionVisible}
          onCancel={() => setVersionVisible(false)}
        />
      )}
      {versionVisibleNew && (
        <VersionModalNew
          visible={versionVisibleNew}
          onCancel={() => setVersionVisibleNew(false)}
        />
      )}
      {importVisible &&
        <ImportModal
          authority={authority}
          visible={importVisible}
          onCancel={() => setImportVisible(false)}
          dataSource={dataSource}
          onSucess={() => {
            setImportVisible(false);
            if (childRef.current) {
              // @ts-ignore
              childRef.current.reloadTable();
            }
          }}
        />
      }
    </div>
  );
};
export default connect()(JiaPurchasePlanPage);
