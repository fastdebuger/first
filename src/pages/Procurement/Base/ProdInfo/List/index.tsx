import React, {useRef, useEffect, useState} from 'react';
import {Button, message, Modal, Select, Upload} from 'antd';
import {connect, useIntl} from 'umi';
import {CONST, ErrorCode} from '@/common/const';
import {getTemplateCode, hasPermission} from '@/utils/authority';
import {BasicTableColumns} from 'qcx4-components';
import {DownloadOutlined, ToTopOutlined} from '@ant-design/icons/lib';
import {configColumns} from '../columns';
import {ConnectState} from '@/models/connect';
import PrintButton from "@/components/PrintButton";
import BaseFormSearchTable from "@/components/BaseFormSearchTable";
import AddModal from '../component/add'
import EditModal from '../component/edit'
const {confirm} = Modal;
/**
 * 物料信息
 * @param props
 * @constructor
 */
const MatreialProdInfoPage: React.FC<any> = (props) => {
  const {dispatch, authority,moduleCaption} = props;
  const {formatMessage} = useIntl();
  const childRef = useRef();
  const [addVisible,setAddVisible] = useState<boolean>(false)
  const [editVisible,setEditVisible] = useState<boolean>(false)
  const [initData,setInitData] = useState<any>(null)

  useEffect(()=>{
    dispatch({
      type: 'common/fetchDevList',
    });
    dispatch({
      type: 'materialclsinfo/getMaterialClsInfo',
      payload: {
        sort: 'cls_code',
        order: 'asc',
      },
    });
  },[])

  const batchDelete=(val: any)=>{
    let arr: any = ''
    const code: any = []
    val.forEach((item: any,index: any)=>{
      if(index===val.length-1){
        arr = arr + `'${item.prod_code}'`
      }else {
        arr = arr + `'${item.prod_code}'` + ','
      }
      code.push(item.prod_code)
    })
    confirm({
      title: `确定要删除物料编码 : ${code}?`,
      okText: formatMessage({id: 'common.delete'}),
      cancelText: formatMessage({id: 'common.cancel'}),
      onOk() {
        dispatch({
          type: 'matreialprodinfo/batchDeleteMaterialProdInfo',
          payload: {
            delId: arr
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
   * 修改
   * @param fields
   */
  const handleEdit = (fields: any) => {
    if (dispatch) {
      Object.assign(fields, {
        unit_weight: Number(fields.unit_weight),
      });
      dispatch({
        type: 'matreialprodinfo/updateMatreialProdInfo',
        payload: fields,
        callback: (res: any) => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.reloadTable();
          }
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(formatMessage({id: 'common.list.edit.success'}));
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
          'upload_ts',
          //'upload_ts_str'
        ]).setTableColumnToDatePicker([
        {value: 'upload_ts', valueType: 'dateTs'},
      ])
        .needToHideInTableButExport([
          // 'upload_ts_str'
        ]).noNeedToExport([
        'upload_ts',
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
    '><': [],
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
        style={{display: hasPermission(authority, '新增') ? 'inline' : 'none'}}
        type='primary'
        size='middle'
        onClick={() => {
          setAddVisible(true)
        }}
      >
        新增
      </Button>,
      <Button
        style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
        type='primary'
        size='middle'
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning('请选择一条数据');
            return;
          }
          setEditVisible(true)
          setInitData(selectedRows[0])
        }}
      >
        编辑
      </Button>,
      <Button
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        type='primary'
        size='middle'
        onClick={() => {
          if (selectedRows.length < 1) {
            message.warning('请至少选择一条数据');
            return;
          }
          batchDelete(selectedRows)
        }}
      >
        删除
      </Button>,
      <PrintButton
        selectedRows={selectedRows}
      />,
      <Button
        type='primary'
        size='middle'
        style={{display: hasPermission(authority, '物料信息模版') ? 'inline' : 'none'}}
        onClick={() => {
          if (childRef.current) {
            childRef.current.downloadImportFile(getTemplateCode(authority, '物料信息模版'),moduleCaption);
          }
        }}
      >
        {formatMessage({id: 'common.list.template'})}
      </Button>,
      <Upload
        showUploadList={false}
        name='file'
        accept={CONST.IMPORT_FILE_TYPE}
        beforeUpload={(file) => {
          if (childRef.current) {
            childRef.current.importFile(file, getTemplateCode(authority, '物料信息模版'));
          }
          return false;
        }}
      >
        <Button
          style={{display: hasPermission(authority, '导入') ? 'inline' : 'none'}}
          type='primary'
          size='middle'
          icon={<ToTopOutlined/>}>
          {formatMessage({id: 'common.list.import'})}
        </Button>
      </Upload>,
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
        type='matreialprodinfo/getMatreialProdInfo'
        exportType='matreialprodinfo/getMatreialProdInfo'
        importType='matreialprodinfo/import'
        toolBarRender={toolBarRender}
        operator={operator}
        rowSelection={{
          type: 'checkbox',
        }}
      />
      {addVisible&&<AddModal
        visible={addVisible}
        onCancel={()=>setAddVisible(false)}
        onSucess={()=>{
          setAddVisible(false)
          if (childRef.current) {
            // @ts-ignore
            childRef.current.reloadTable();
          }
        }}
      />}
      {editVisible&&<EditModal
        visible={editVisible}
        initData = {initData}
        onCancel={()=>setEditVisible(false)}
        onSucess={()=>{
          setEditVisible(false)
          if (childRef.current) {
            // @ts-ignore
            childRef.current.reloadTable();
          }
        }}
      />}

    </div>
  );
};

export default connect(({common, materialclsinfo}: ConnectState) => ({
  devList: common.devList,
  materialClsInfoList: materialclsinfo.materialClsInfoList,
}))(MatreialProdInfoPage);
