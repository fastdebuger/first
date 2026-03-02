import React, { useEffect, useRef, useState } from 'react';
import { connect, useIntl } from 'umi';
import { hasPermission, getTemplateCode } from '@/utils/authority';
import { Button, message, Modal, Select, Upload } from 'antd';
import { BasicTableColumns } from 'qcx4-components';
import BaseFormSearchTable from '@/components/BaseFormSearchTable';
import { CONST, ErrorCode } from '@/common/const';
import { configColumns } from '../columns';
import AddModal from '../add/index';
import DetailModal from '../detail/index';
import EditModal from '../edit/index';
import { FuncCode } from '@/common/const';
const { confirm } = Modal;
/**
 * 甲供需求计划单
 * @param props
 * @constructor
 */
const JiaPurchasePlanPage: React.FC<any> = (props: any) => {
  const { dispatch, moduleCaption, authority } = props;

  const childRef: any = useRef();
  const { formatMessage } = useIntl();
  const [templateStatus, setTemplateStatus] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditlVisible] = useState(false);
  const [record, setRecord] = useState<any>({});

  const [templateCode, setTemplateCode] = useState('');
  const [selectValue, setSelectValue] = useState('')
  const [purchaseGroup, setPurchaseGroup] = useState(null)

  useEffect(() => {
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
  }, []);

  const handleChange = (string) => {
    console.log('object :>> ', e);
    const srt = String(string)
    setSelectValue(srt)
  }

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
        'form_no',
        'purchase_strategy_no',
        'dep_name',
        'dev_name',
        'unit_project_name',
        'unit_name',
        'supply_type_str',
        'warehouse_name_str',
        'info_cls_name',
        'form_no_show',
        'po_price',
        'delivery_points',
        'user_name',
        'tel_num'
      ])

    return cols.getNeedColumns();
  };
  // 定义按钮
  const toolBarRender = (selectedRows: any) => {
    return [
      // <Button
      //   key={1}
      //   // style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
      //   size="middle"
      //   type="primary"
      //   onClick={() => {
      //     setAddVisible(true);
      //   }}
      // >
      //   {formatMessage({ id: 'common.add' })}
      // </Button>,
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
        onClick={() => {
          // console.log('object :>> ');
          if (selectedRows.length !== 1) {
            message.warning(formatMessage({ id: 'common.selected.row.is.one' }));
            return;
          }

          // /ZyyjIms/supplier/poPlan/addPoPlanB1
          Modal.confirm({
            title: '请选择采购组',
            icon: undefined,
            content: (
              <div>
                {
                  'xxxx'
                  // purchaseGroup
                  // <Select
                  //   style={{
                  //     width: 200
                  //   }}
                  //   value={selectValue}
                  //   onChange={(val) => setSelectValue(val)}
                  //   placeholder="请选择用户组"
                  //   showSearch
                  //   allowClear
                  //   filterOption={(input, opt) => {
                  //     // @ts-ignore
                  //     return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  //   }}
                  // >
                  //   {purchaseGroup &&
                  //     purchaseGroup.map((devItem: any) => {
                  //       return (
                  //         <Option key={devItem.id} value={devItem.id}>
                  //           {devItem.purchase_group_name}
                  //         </Option>
                  //       );
                  //     })}
                  // </Select>
                }
              </div>
            ),
            onOk: (close) => {
              if (selectValue) {
                console.log('object :>> ', selectValue);
                // close()
              } else {
                message.error('请选择用户组')
              }
              console.log('res :>> ', close);
            }
          })
        }}
      >
        生成采购计划一级
      </Button>
      // <Button
      //   type="primary"
      //   size="middle"
      //   style={{ display: hasPermission(authority, '需求计划单模版') ? 'inline' : 'none' }}
      //   onClick={() => {
      //     if (childRef.current) {
      //       // @ts-ignore
      //       childRef.current.downloadImportFile(isShowNetAndMargin ? `${getTemplateCode(authority, '需求计划单模版')}_1` : getTemplateCode(authority, '需求计划单模版'));
      //     }
      //   }}
      // >
      //   {formatMessage({ id: 'common.list.template' })}
      // </Button>,
      // <Upload
      //   key={4}
      //   showUploadList={false}
      //   name="file"
      //   accept={CONST.IMPORT_FILE_TYPE}
      //   beforeUpload={(file) => {
      //     childRef.current.importFile(
      //       file,
      //       isShowNetAndMargin ? `${getTemplateCode(authority, '需求计划单模版')}_1` : getTemplateCode(authority, '需求计划单模版'),
      //       importPurchasePlanByInteraction ? importInteraction : undefined,
      //     );
      //   }}
      // >
      //   <Button
      //     key={5}
      //     style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
      //     size="middle"
      //     type="primary"
      //   >
      //     {formatMessage({ id: 'common.import' })}
      //   </Button>
      // </Upload>,
      // <Button
      //   style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
      //   key={7}
      //   size="middle"
      //   type="primary"
      //   onClick={() => {
      //     // @ts-ignore
      //     childRef.current.exportFile(1, getTableColumns());
      //   }}
      // >
      //   {formatMessage({ id: 'common.export' })}
      // </Button>
    ];
  };

  const selectedRowsToolbar = (rows: any) => {
    return [

    ]
  }

  const addModalSucess = () => {
    setAddVisible(false);
    setEditlVisible(false);
    if (childRef.current) {
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


  return (
    <div style={{ backgroundColor: '#fff', marginTop: -16 }}>
      <BaseFormSearchTable
        cRef={childRef}
        selectedRowsToolbar={selectedRowsToolbar}
        moduleCaption={moduleCaption}
        rowKey="form_no"
        funcCode={authority + '采购计划12'}
        tableSortOrder={{ sort: 'form_no', order: 'desc' }}
        formColumns={[]}
        tableColumns={getTableColumns()}
        type="poPlan/queryPoPlanHead"
        importType="jiapurchaseplan/import"
        exportType="poPlan/queryPoPlanHead"
        toolBarRender={toolBarRender}
        dateCols={[]}
        operator={operator}
        identityCols={[]}
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

    </div>
  );
};
export default connect()(JiaPurchasePlanPage);
