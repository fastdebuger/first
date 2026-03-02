import React, {useRef, useState} from 'react';
import {Button, message, Modal} from 'antd';
import {connect, useIntl} from 'umi';
import {ErrorCode} from '@/common/const'; // CONST
import {
  hasAddPermission,
  hasDeletePermission,
  hasModifyPermission,
} from '@/utils/authority';
import {configColumns} from './columns';

import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import {BasicTableColumns} from "yayang-ui";
import AddModal from './Add'
import DetailModal from './Detail'
import EditModal from "./Edit"

const {confirm} = Modal;
import {DownloadOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

/**
 * @param props
 * @constructor
 */
const ClsConfig: React.FC<any> = (props) => {
  const {formatMessage} = useIntl();
  const {
    route: {authority, name},
    dispatch,
  } = props;
  const childRef = useRef();
  const [addVisible, setAddVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [editVisible, setEditVisible] = useState(false);

  const handleDel = (delSelectRows: any) => {
    confirm({
      title: '是否删除当前的数据吗?',
      icon: <ExclamationCircleOutlined/>,
      okType: 'danger',
      okText: formatMessage({id: 'common.yes'}),
      cancelText: formatMessage({id: 'common.no'}),
      onOk() {
        return new Promise((resolve: any) => {
          dispatch({
            type: 'materialclsconfig/deleteMaterialClsConfig',
            payload: {
              id: delSelectRows.id,
            },
            callback: (res: any) => {
              resolve();
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("删除成功");
                if (childRef.current) {
                  // @ts-ignore
                  childRef.current.reloadTable();
                }
              }
            },
          });
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      },
    });
  };

  /**
   * 获取表格配置
   */
  const getTableColumns = () => {
    const fixedCol = new BasicTableColumns(configColumns);
    return fixedCol
      .initTableColumns([
        'comp_type_str',
        'dev_name',
        {
          title: formatMessage({id: 'material.cls_code_show'}),
          subTitle: '仓库名称',
          dataIndex: 'total_cls_name',
          width: 160,
          align: 'center',
          sorter: true,
          render: (text: string, record: any) => {
            return (
              <a
                onClick={() => {
                  setSelectedRecord(record);
                  setOpen(true);
                }}
              >
                {text || '-'}
              </a>
            );
          },
        },
        'allow_split_more',
        'allow_out_store_rate_more',
      ]).needToExport([
        'comp_type_str',
        'dev_name',
        'total_cls_name',
        'allow_split_more',
        'allow_out_store_rate_more',
      ])
      .getNeedColumns();
  };


  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (
    reloadTable: (filters?: [], noFilters?: []) => void
  ) => {
    return [
      <Button
        style={{display: hasAddPermission(authority) ? 'inline-block' : 'none'}}
        type="primary"
        onClick={() => {
          setAddVisible(true);
        }}
      >
        新建
      </Button>,
      <Button
        type="text"
        icon={<DownloadOutlined/>}
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

  /**
   * 列操作按钮
   */
  const renderSelectedRowsToolbar = (selectedRows: any) => [
    <Button
      style={{display: hasModifyPermission(authority) ? 'inline-block' : 'none'}}
      type="primary"
      onClick={() => {
        if (selectedRows.length !== 1) {
          message.warn('请选择一条数据')
        } else {
          setSelectedRecord(selectedRows[0])
          setEditVisible(true);
        }
      }}
    >
      编辑
    </Button>,
    <Button
      style={{display: hasDeletePermission(authority) ? 'inline-block' : 'none'}}
      danger type='primary' onClick={() => {
      if (selectedRows.length !== 1) {
        message.warn('请选择一条数据')
      } else {
        handleDel(selectedRows[0])
        setSelectedRecord(selectedRows[0])
      }
    }}>
      删除
    </Button>
  ]

  return (
    <div style={{padding: 0}}>
      <BaseCurdSingleTable
        cRef={childRef}
        moduleCaption={name}
        rowKey="id"
        funcCode={authority + 'getMaterialClsConfig'}
        height={'calc(100vh - 340px)'}
        tableTitle="物料分类配置信息"
        type="materialclsconfig/getMaterialClsConfig"
        exportType="materialclsconfig/getMaterialClsConfig"
        tableColumns={getTableColumns()}
        tableSortOrder={{sort: 'id', order: "desc"}}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {open && selectedRecord && (
        <DetailModal
          open={open}
          visible={open}
          actionRef={childRef}
          selectedRecord={selectedRecord}
          onClose={() => setOpen(false)}
        />
      )}
      {addVisible && (
        <AddModal
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackAddSuccess={() => {
            setAddVisible(false);
            if (childRef && childRef.current) {
              // @ts-ignore
              childRef.current.reloadTable();
            }
          }}
        />
      )}
      {editVisible && (
        <EditModal
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackAddSuccess={() => {
            setEditVisible(false);
            if (childRef.current) {
              childRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  );
};

export default connect()(ClsConfig);
