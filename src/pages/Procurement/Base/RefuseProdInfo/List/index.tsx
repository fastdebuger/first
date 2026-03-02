import React, {useRef, useEffect, useState} from 'react';
import {Button, message, Modal} from 'antd';
import {connect, useIntl} from 'umi';
import { ErrorCode} from '@/common/const';
import {hasPermission} from '@/utils/authority';
import {BasicTableColumns} from 'qcx4-components';
import {DownloadOutlined} from '@ant-design/icons/lib';
import {configColumns} from '../columns';
import {ConnectState} from '@/models/connect';
import BaseFormSearchTable from "@/components/BaseFormSearchTable";
import AddModal from '../component/add'
const {confirm} = Modal;

/**
 * 物料信息
 * @param props
 * @constructor
 */
const RefuseProdInfoPage: React.FC<any> = (props) => {
  const {dispatch, authority,moduleCaption} = props;
  const {formatMessage} = useIntl();
  const childRef = useRef();
  const [addVisible,setAddVisible] = useState<boolean>(false)

  /**
   * 解除物料限制
   * @param rows
   */
  const handleBatchDelete=(rows: any[])=>{
    confirm({
      title: `确定要解除以下物料编码的限制嘛 : ${rows.map(r => r.prod_code).join("、")}?`,
      okText: formatMessage({id: 'common.delete'}),
      cancelText: formatMessage({id: 'common.cancel'}),
      onOk() {
        dispatch({
          type: 'matreialprodinfo/batchDelRefuseOutStorageLst',
          payload: {
            delId: `'${rows.map(r => r.prod_code).join("','")}'`
          },
          callback: (res: any) => {
            if (res.errCode === ErrorCode.ErrOk) {
              message.success(formatMessage({id: 'common.list.del.success'}));
            }
            if (childRef.current) {
              // @ts-ignore
              childRef.current.reloadTable();
            }
          },
        });
      },
    });
  }

  /**
   * 批量新增
   * @param rows
   */
  const handleBatchAdd = (rows: any[]) => {
    if (dispatch) {
      dispatch({
        type: 'matreialprodinfo/batchAddRefuseOutStorageLst',
        payload: {
          addId: JSON.stringify(rows.map(r => r.prod_code)),
        },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
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

  const getTableColumns = () => {
    const dnCol = new BasicTableColumns(configColumns);
    return (
      dnCol
        .initTableColumns([
          'prod_code',
          'prod_name',
          'aid_name',
          'cls_code',
          'cls_name',
          'material',
          'material_type',
          'unit_weight',
          'spec',
          'unit',
          'prod_describe',
          'standard',
          'remark',
        ])
        .getNeedColumns()
    );
  };

  // 定义过滤的条件
  const operator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': ['upload_ts'],
    noFilters: [],
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
  const toolBarRender = (selectedRows: any) => {
    // @ts-ignore
    return [
      <Button
        // style={{display: hasPermission(authority, '批量新增') ? 'inline' : 'none'}}
        type='primary'
        size='middle'
        onClick={() => {
          setAddVisible(true)
        }}
      >
        批量新增
      </Button>,
      <Button
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        icon={<DownloadOutlined/>}
        type='primary'
        size='middle'
        onClick={() => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.exportFile(1,moduleCaption);
          }
        }}
      >
        {formatMessage({id: 'common.list.export'})}
      </Button>,
      <Button
        style={{display: hasPermission(authority, '删除') ? 'inline' : 'none'}}
        type='primary'
        danger
        size='middle'
        onClick={() => {
          if (selectedRows.length < 1) {
            message.warning('未选择物料');
            return;
          }
          handleBatchDelete(selectedRows);
        }}
      >
        解除限制
      </Button>,
    ];
  };

  return (
    <div>
      <BaseFormSearchTable
        cRef={childRef}
        moduleCaption={moduleCaption}
        rowKey="prod_code"
        tableSortOrder={{sort: 'upload_ts', order: 'desc'}}
        formColumns={[]}
        tableColumns={getTableColumns()}
        type='matreialprodinfo/queryRefuseOutStorageLst'
        exportType='matreialprodinfo/queryRefuseOutStorageLst'
        toolBarRender={toolBarRender}
        operator={operator}
        rowSelection={{
          type: 'checkbox',
        }}
      />
      {addVisible&&<AddModal
        visible={addVisible}
        onCancel={()=>setAddVisible(false)}
        handleBatchAdd={handleBatchAdd}
      />}
    </div>
  );
};

export default connect(({common, materialclsinfo}: ConnectState) => ({
  devList: common.devList,
  materialClsInfoList: materialclsinfo.materialClsInfoList,
}))(RefuseProdInfoPage);
