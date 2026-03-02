import React, { useEffect, useRef, useState } from 'react';
import { connect, useIntl } from 'umi';
import { Button, message, Modal, Tag, Upload } from 'antd';
import { BasicTableColumns } from 'qcx4-components';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import { CONST } from '@/common/const';
import { configColumns } from '../columns';
import { errColumns } from '../errColumns';
import { getTemplateCode, hasPermission } from "@/utils/authority";
import AddModal from "../add/index";
import DetailModal from "../detail/index";
import EditModal from "../edit/index";
import VersionModalNew from '../version';
import { getCurDepFullCode } from "@/utils/utils";

const { confirm } = Modal;

/**
 * 甲供分割预算
 * @param props
 * @constructor
 */
const JIaSplitBudgetPage: React.FC<any> = (props: any) => {
  const { dispatch, authority, moduleCaption } = props;
  const isApproval = localStorage.getItem('system-is-open-approval') === '1';
  const childRef: any = useRef();
  const { formatMessage } = useIntl();
  const [templateStatus, setTemplateStatus] = useState(false)
  const [addVisible, setAddVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [editVisible, setEditlVisible] = useState(false)
  const [record, setRecord] = useState<any>({})
  const [versionVisible, setVersionVisible] = useState(false);
  const [versionVisibleNew, setVersionVisibleNew] = useState(false)
  const isShowNetAndMargin = localStorage.getItem('system-isShowNetAndMargin') === 'true'
  const [templateCode, setTemplateCode] = useState('');
  const [isCompanyAllowApproval, setIsCompanyAllowApproval] = useState(false)





  useEffect(() => {
    dispatch({
      type: 'processTemplate/queryProcessFuncCodeTemplate',
      payload: {
        sort: 'template_code',
        order: 'asc',
      },
      callback: (res: any) => {
        if (res && res.rows) {
          const tar: any[] = [];
          res.rows.forEach((it: any) => {
            if (it.func_code === "C08F010" && it.template_name) {
              tar.push(it)
            }
          });
          console.log(tar)
          if (tar.length > 0) {
            setTemplateCode(tar[0].template_code)
            setTemplateStatus(true)
          }
        }
      },
    });
  }, [])


  // 查询物料分类配置 得到分割超计划比例
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'materialclsconfig/getMaterialClsConfig',
        payload: {
          sort: 'cls_code',
          order: 'asc',
        },
      });
    }
  }, []);
  /**
   * 删除
   * @param fields
   */
  const handleDelete = (fields: any) => {
    confirm({
      title: formatMessage({ id: 'common.ordelete' }),
      okText: formatMessage({ id: 'common.delete' }),
      cancelText: formatMessage({ id: 'common.cancel' }),
      onOk() {
        dispatch({
          type: 'jiasplitbudget/delSplitBudget',
          payload: {
            form_no: fields.form_no || '',
            dev_code: fields.dev_code || '',
          },
          callback: (res: any) => {

            if (res.errCode === 0) {
              message.success(formatMessage({ id: 'common.delete.successMsg' }));
              if (childRef.current) {
                // @ts-ignore
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
          width: 260,
          render: (text, row) => {
            let name: any = text || '';
            if (name === '' || name === null) name = '-'
            return (
              <>
                <a
                  onClick={() => {
                    setDetailVisible(true)
                    setRecord(row)
                  }}
                >
                  {name}
                </a>
                {row.data_source === 'meter' && <Tag style={{ marginLeft: 4 }} color={"gold"} >仪表</Tag>}
                {row.data_source === 'electric' && <Tag style={{ marginLeft: 4 }} color={'volcano'} >电气</Tag>}
                {row.data_source === 'steel' && <Tag style={{ marginLeft: 4 }} color={'blue'} >钢结构</Tag>}
              </>
            );
          },
        },
        'form_date_format',
        'dev_name',
        'unit_project_name',
        {
          title: 'material.unit_name',
          dataIndex: 'unit_name',
          align: 'center',
          width: 260,
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
        'obs_name',
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


  // 获取导入失败展示表格配置
  const getErrorTableColumns = () => {
    const cols = new BasicTableColumns(errColumns);
    cols
      .initTableColumns([
        "pipe_code",
        "pipe_image_no",
        "pipe_section_code",
        "prod_code",
        "plan_num",
        "split_num",
        "allow_split_more",
        "allow_split_num",
        "rest_split_num",
        "sub_split_num"
      ])
    return cols.getNeedColumns();
  };
  // 定义按钮
  const toolBarRender = (selectedRows: any[]) => {
    return [
      <Button
        key={1}
        style={{ display: hasPermission(authority, '分割预算单新增') ? 'inline' : 'none' }}
        size='middle'
        type='primary'
        onClick={() => {
          setAddVisible(true)
        }}
      >
        {formatMessage({ id: 'common.add' })}
      </Button>,
      <Button
        key={2}
        style={{ display: hasPermission(authority, '分割预算单编辑') ? 'inline' : 'none' }}
        size='middle'
        type='primary'
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning(formatMessage({ id: 'common.selected.row.is.one' }));
            return;
          }
          

          setEditlVisible(true)
          setRecord(selectedRows[0])
        }}
      >
        {formatMessage({ id: 'common.edit' })}
      </Button>,
      <Button
        key={3}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        size='middle'
        type='primary'
        danger
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
         
          handleDelete(selectedRows[0]);
        }}
      >
        {formatMessage({ id: 'common.delete' })}
      </Button>,
      <Button
        type='primary'
        size='middle'
        style={{ display: hasPermission(authority, '分割预算单模版') ? 'inline' : 'none' }}
        onClick={() => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.downloadImportFile(isShowNetAndMargin ? `${getTemplateCode(authority, '分割预算单模版')}_1` : getTemplateCode(authority, '分割预算单模版'));
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
          childRef.current.importFile(file, isShowNetAndMargin ? `${getTemplateCode(authority, '分割预算单模版')}_1` : getTemplateCode(authority, '分割预算单模版'));
        }}
      >
        <Button
          key={5}
          size="middle"
          style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
          type="primary"
        >
          {formatMessage({ id: 'common.import' })}
        </Button>
      </Upload>,
      <Button
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        key={7}
        size='middle'
        type='primary'
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, getTableColumns());
        }}
      >
        {formatMessage({ id: 'common.export' })}
      </Button>,
    ];
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
  // 定义过滤的条件
  const errOperator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': [],
    noFilters: ['subDetailTbl'],
  };

  const addModalSucess = () => {
    setAddVisible(false)
    setEditlVisible(false)
    if (childRef.current) {
      // @ts-ignore
      childRef.current.reloadTable();
    }
  }

  // 获取表格配置
  const getVersionTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_code',
        'anti_rank',
        'split_num',
        'cls_name',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'prod_memo',
        'prod_name',
        'prod_describe',
        'material',
        'unit',
        'spec',
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
        'split_num_version1',
        'split_num_version2',
        'pipe_code',
        'pipe_image_no',
        'pipe_section_code',
        'total_weight',
        'arrival_place',
        'cls_name',
        'material',
        'spec',
        'unit',
        'unit_weight',
        'prod_describe',
        'prod_memo',
      ])
    return cols.getNeedColumns();
  };

  const selectedRowsToolbar = (rows: any) => {
    return [
      <Button
        type={"primary"}
        onClick={() => {
          const arr: any = []
          rows.forEach((item: any) => arr.push(item.form_no))
          const currDepCode = localStorage.getItem('auth-default-currWbsCode');
          const currDate = new Date();
          const tzArea = currDate.getTimezoneOffset() / 60;
          const tz = tzArea < 0 ? Math.abs(tzArea) : -tzArea;
          window.open(
            `${CONST.HOST_RPT}?&reportlet=Materials2.0/batch/JiaSplit(Cls).cpt&currDepCode=${currDepCode}&depCode=${getCurDepFullCode()}&form_no=${arr.join(',')}&tz=${tz}&op=view`,
          );
        }}
      >
        批量打印(物料分类分页)
      </Button>
    ]
  }

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <BaseFormSearchTable
        cRef={childRef}
        rowKey='form_no'
        moduleCaption={moduleCaption}
        tableSortOrder={{ sort: 'modify_time', order: 'desc' }}
        formColumns={[]}
        funcCode={authority+'分割预算'}
        tableColumns={getTableColumns()}
        type='jiasplitbudget/querySplitBudgetHead'
        importType="jiasplitbudget/importSplitBudget"
        exportType='jiasplitbudget/querySplitBudgetHead'
        errType='jiasplitbudget/queryDeductionListDetail'
        errTableColumns={getErrorTableColumns()}
        errTableSortOrder={{ sort: 'prod_code', order: 'desc' }}
        toolBarRender={toolBarRender}
        selectedRowsToolbar={selectedRowsToolbar}
        operator={operator}
        errOperator={errOperator}
        rowSelection={{
          type: 'checkbox',
        }}
      />
      {addVisible &&
        <AddModal
          visible={addVisible}
          onSucess={addModalSucess}
          onCancel={() => setAddVisible(false)}
        />}
      {detailVisible &&
        <DetailModal
          moduleCaption={`${moduleCaption}详情`}
          visible={detailVisible}
          record={record}
          onCancel={() => setDetailVisible(false)}
        />}
      {editVisible &&
        <EditModal
          visible={editVisible}
          record={record}
          onSucess={addModalSucess}
          onCancel={() => setEditlVisible(false)}
        />}
     
      {versionVisibleNew && (
        <VersionModalNew
          visible={versionVisibleNew}
          onCancel={() => setVersionVisibleNew(false)}
        />
      )}
    </div>
  );
};
export default connect()(JIaSplitBudgetPage);
