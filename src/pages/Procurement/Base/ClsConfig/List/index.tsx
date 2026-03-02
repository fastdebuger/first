import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Select} from 'antd';
import {connect, useIntl} from 'umi';
import {ErrorCode} from '@/common/const';

import {BasicEditableColumns} from 'qcx4-components';
import BasicEditableProTable from '@/components/BasicEditableProTable';
import {DownloadOutlined} from '@ant-design/icons/lib';
import {configColumns} from '../columns';
import {ConnectState} from '@/models/connect';
import {hasPermission} from "@/utils/authority";

const {Option} = Select;

/**
 * 物料分类配置
 * @param props
 * @constructor
 */
const MaterialClsConfigPage: React.FC<any> = (props) => {
  const {dispatch, authority, materialClsInfoList, pane, devList,moduleCaption} = props;
  const {formatMessage} = useIntl();
  const childRef = useRef();
  /**
   * 新增
   * @param fields
   */
  const handleAdd = (fields: any) => {
    if (dispatch) {
      dispatch({
        type: 'materialclsconfig/addMaterialClsConfig',
        payload: Object.assign(fields, {
          allow_in_store_rate_more: 0,
          dev_code: fields.dev_name,
          cls_code: fields.total_cls_name,
        }), // 业务不需要这个字段 allow_in_store_rate_more 但是后台修改的时候报错
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            dispatch({
              type: 'global/removeOtherTab',
              payload: pane,
            });
            message.success(formatMessage({id: 'common.list.add.success'}));
          }
          if (childRef.current) {
            // @ts-ignore
            childRef.current.reloadTable();
          }
        },
      });
    }
  };

  /**
   * 删除
   * @param fields
   */
  const handleDel = (fields: any) => {
    dispatch({
      type: 'materialclsconfig/deleteMaterialClsConfig',
      payload: {
        id: fields.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          dispatch({
            type: 'global/removeOtherTab',
            payload: pane,
          });
          message.success(formatMessage({id: 'common.list.del.success'}));
        }
        if (childRef.current) {
          // @ts-ignore
          childRef.current.reloadTable();
        }
      },
    });
  };

  /**
   * 修改
   * @param fields
   */
  const handleEdit = (fields: any) => {
    if (dispatch) {
      dispatch({
        type: 'materialclsconfig/updateMaterialClsConfig',
        payload: Object.assign(fields, {
          dev_code: fields.dev_code
        }),
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            dispatch({
              type: 'global/removeOtherTab',
              payload: pane,
            });
            message.success(formatMessage({id: 'common.list.edit.success'}));
          }
          if (childRef.current) {
            // @ts-ignore
            childRef.current.reloadTable();
          }
        },
      });
    }
  };
  console.log(materialClsInfoList)
  const getTableColumns = () => {
    const dnCol = new BasicEditableColumns(configColumns);
    return dnCol
      .initTableColumns([
        {
          title: formatMessage({id: 'material.dev_name'}),
          dataIndex: 'dev_name',
          width: 160,
          align: 'center',
          editable: true,
          renderSelfEditable: (record, handleSave, headerForm) => {
            const onChange = (code: string) => {
              const copyRecord = {...record};
              Object.assign(copyRecord, {
                dev_code: code,
              });
              handleSave(copyRecord)
              console.log('-----headerForm', headerForm)
              headerForm.setFieldsValue({
                dev_code: code,
              })
            };
            return <Select
              placeholder="装置名称"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={onChange}
            >
              {devList &&
              devList
                .map((devItem: any) => {
                  return (
                    <Option key={devItem.dev_code} value={devItem.dev_code}>
                      {devItem.dev_name}
                    </Option>
                  );
                })}
            </Select>;
          },
        },
        'dev_code',
        {
          title: formatMessage({id: 'material.cls_code_show'}),
          dataIndex: 'total_cls_name',
          width: 160,
          align: 'center',
          editable: true,
          render: (text, record) => {
            return <span>{record.total_cls_name}</span>
          },
          renderSelfEditable: (record, handleSave, headerForm) => {
            const onChange = (code: string) => {
              const copyRecord = {...record};
              Object.assign(copyRecord, {
                cls_code: code,
              });
              handleSave(copyRecord);
              headerForm.setFieldsValue({
                cls_code: code,
              })
            };
            return <Select
              placeholder="分类名称"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
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
            </Select>;
          },
        },
        'cls_code',
        // 'cls_name',
        'allow_split_more',
        'allow_out_store_rate_more',
      ])
      .noNeedToExport(['dev_code','cls_code'])
      .setTableColumnToSelect([
        {
          value: 'dev_code',
          name: 'wbs_name',
          valueAlias: 'wbs_code',
          valueType: 'select',
          data: devList || [],
        }, {
          value: 'cls_code',
          name: 'key',
          valueType: 'select',
          data: materialClsInfoList || [],
        },
      ])
      .needToHideInTableButExport(['cls_code','dev_code'])
      .setTableColumnToInputNumber([
        {value: 'allow_split_more', min: 0, valueType: 'percent'},
        {value: 'allow_out_store_rate_more', min: 0, valueType: 'percent'},
      ])
      .needToRules(['dev_name', 'cls_code', 'allow_split_more', 'allow_out_store_rate_more'])
      .noNeedToEditable([
        'cls_name',
        {
          value: 'cls_code',
          editableFunc: (text: any, record: any) => {
            return record.cls_code;
          },
        },
      ])
      .getNeedColumns();
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

  const toolBarRender = (action: any, {selectedRows}: any) => {
    return [
      <Button
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        icon={<DownloadOutlined/>}
        type="primary"
        size="middle"
        onClick={() => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.exportFile();
          }
        }}
      >
        {formatMessage({id: 'common.list.export'})}
      </Button>,
    ];
  };
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
  return (
    <div>
      <BasicEditableProTable
        cRef={childRef}
        rowKey="id"
        moduleCaption={moduleCaption}
        addPerm={hasPermission(authority, '新增')}
        editPerm={hasPermission(authority, '编辑')}
        delPerm={hasPermission(authority, '删除')}
        sortOrder={{sort: 'dev_name,cls_code', order: 'asc'}}
        operator={operator}
        identityCols={[]}
        type="materialclsconfig/getMaterialClsConfig"
        exportType="materialclsconfig/getMaterialClsConfig"
        callbackAdd={handleAdd}
        callbackEdit={handleEdit}
        callbackDel={handleDel}
        tableColumns={getTableColumns()}
        toolBarRender={toolBarRender}
      />
    </div>
  );
};

export default connect(({common, materialclsinfo}: ConnectState) => ({
  devList: common.devList,
  materialClsInfoList: materialclsinfo.materialClsInfoList,
}))(MaterialClsConfigPage);
