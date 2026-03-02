import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { connect, useIntl } from 'umi';
import { ErrorCode } from '@/common/const'; // CONST
import {
  getTemplateCode,
  hasAddPermission,
  hasDeletePermission,
  hasExportPermission,
  hasModifyPermission,
  hasPermission,
} from '@/utils/authority';
import { configColumns } from './columns';

import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns, BaseImportModal } from "yayang-ui";
import AddModal from './Add'
import DetailModal from './Detail'
import EditModal from "./Edit"

const { confirm } = Modal;
import { DownloadOutlined, ExclamationCircleOutlined, ToTopOutlined } from "@ant-design/icons";
import PrintButton from "@/components/PrintButton";

/**
 * @param props
 * @constructor
 */
const ProdInfoConfig: React.FC<any> = (props) => {
  const { formatMessage } = useIntl();
  const {
    route: { authority, name },
    dispatch,
  } = props;
  const childRef = useRef();
  const [addVisible, setAddVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);

  const handleDel = (delSelectRows: any) => {
    confirm({
      title: '是否删除当前的数据吗?',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      okText: formatMessage({ id: 'common.yes' }),
      cancelText: formatMessage({ id: 'common.no' }),
      onOk() {
        return new Promise((resolve: any) => {
          let arr: any = ''
          delSelectRows.forEach((item: any, index: any) => {
            if (index === delSelectRows.length - 1) {
              arr = arr + `'${item.prod_code}'`
            } else {
              arr = arr + `'${item.prod_code}'` + ','
            }
          })
          dispatch({
            type: 'matreialprodinfo/batchDeleteMaterialProdInfo',
            payload: {
              delId: arr
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
        {
          title: formatMessage({ id: 'material.prod_code' }),
          subTitle: '物料编码',
          dataIndex: 'prod_code',
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
        'prod_name',
        'aid_name',
        'cls_code',
        'cls_name',
        'spec',
        'unit',
        'linear_meter',
        'prod_describe',
        'standard',
        'nps1',
        'nps2',
        'nps3',
        'material',
        'material_type',
        'unit_weight',
        'upload_ts_str',
        // 'upload_ts',
        'owner_prod_code',
        'owner_prod_describe',
        'remark',
      ]).setTableColumnToDatePicker([
        // {value: 'upload_ts', valueType: 'dateTs'},
      ])
      .needToExport([
        'comp_type_str',
        'prod_code',
        'prod_name',
        'aid_name',
        'cls_code',
        'cls_name',
        'spec',
        'unit',
        'linear_meter',
        'prod_describe',
        'standard',
        'nps1',
        'nps2',
        'nps3',
        'material',
        'material_type',
        'unit_weight',
        'upload_ts_str',
        'owner_prod_code',
        'owner_prod_describe',
        'remark',
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
        style={{ display: hasAddPermission(authority) ? 'inline-block' : 'none' }}
        type="primary"
        onClick={() => {
          setAddVisible(true);
        }}
      >
        新建
      </Button>,
      <Button
        style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
        type="text"
        icon={<ToTopOutlined />}
        onClick={() => setImportVisible(true)}
      >
        {formatMessage({ id: 'common.list.import' })}
      </Button>,
      <Button
        type="text"
        icon={<DownloadOutlined />}
        onClick={() => {
          if (childRef.current) {
            // @ts-ignore
            childRef.current.exportFile();
          }
        }}
      >
        {formatMessage({ id: 'common.list.export' })}
      </Button>,
    ];
  };

  /**
   * 列操作按钮
   */
  const renderSelectedRowsToolbar = (selectedRows: any) => [
    <Button
      style={{ display: hasModifyPermission(authority) ? 'inline-block' : 'none' }}
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
    <PrintButton
      selectedRows={selectedRows}
    />,
    <Button
      style={{ display: hasDeletePermission(authority) ? 'inline-block' : 'none' }}
      danger type='primary' onClick={() => {
        handleDel(selectedRows)
        setSelectedRecord(selectedRows[0])
      }}>
      删除
    </Button>
  ]

  return (
    <div style={{ padding: 0 }}>
      <BaseCurdSingleTable
        cRef={childRef}
        moduleCaption={name}
        funcCode={authority + 'getMatreialProdInfo'}
        scroll={{ y: 'calc(100vh - 285px)' }}
        tableTitle="物料信息"
        type='matreialprodinfo/getMatreialProdInfo'
        exportType='matreialprodinfo/getMatreialProdInfo'
        importType='matreialprodinfo/import'
        tableColumns={getTableColumns()}
        rowKey="prod_code"
        tableSortOrder={{ sort: 'upload_ts', order: 'desc' }}
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
      {importVisible && (
        <BaseImportModal
          limitSize={20 * 1024 * 1024}
          visible={importVisible}
          onCancel={() => setImportVisible(false)}
          startUploadFile={(file: any) => {
            return new Promise<boolean>(resolve => {
              if (childRef.current) {
                const formDataFile = new FormData();
                formDataFile.append('file', file)
                formDataFile.append('funcCode', 'C51F001')
                formDataFile.append('FuncCode', 'C51F001')
                formDataFile.append('currWbsCode', localStorage.getItem('auth-default-currWbsCode') || '');
                formDataFile.append('currDepCode', localStorage.getItem('auth-default-currWbsCode') || '');
                dispatch({
                  type: 'matreialprodinfo/importCheckMaterialProdInfo',
                  payload: formDataFile,
                  callback: (res: any) => {
                    if (res.errCode === 0 && res.result && Number(res.result) > 0) {
                      Modal.confirm({
                        title: '导入物料信息校验',
                        content:
                          `存在${res.result}条重复物料,是否继续导入?`,
                        onOk() {
                          const formData = new FormData();
                          return childRef.current.importFile(
                            file, formData, getTemplateCode(authority, '物料信息模版'),
                            () => {
                              setImportVisible(false)
                            }
                          );
                        },
                        onCancel() {
                          resolve(true)
                          //setImportVisible(false)
                        },
                        okText: '继续导入',
                        cancelText: '取消'
                      });
                    } else {
                      const formData = new FormData();
                      return childRef.current.importFile(
                        file, formData, getTemplateCode(authority, '物料信息模版'),
                        () => {
                          setImportVisible(false)
                        }
                      );
                    }
                  },
                });
              }
            }).catch(() => console.log('Oops errors!'));

          }}
          downLoadTemplate={() => {
            if (childRef.current) {
              // @ts-ignore
              childRef.current.downloadImportFile(getTemplateCode(authority, '物料信息模版'));
            }
          }}
        />
      )}
    </div>
  );
};

export default connect()(ProdInfoConfig);
