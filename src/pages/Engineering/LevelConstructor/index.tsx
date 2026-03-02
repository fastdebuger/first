import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

import { configColumns } from "./columns";
import Add from "./Add";
import Detail from "./Detail";
import Edit from "./Edit";

/**
 * 一级建造师
 * @constructor
 */
const LevelConstructor: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  // 控制添加弹窗显示状态的状态变量
  const [addVisible, setAddVisible] = useState<boolean>(false);
  // 控制编辑弹窗显示状态的状态变量
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制某个面板或菜单展开状态的状态变量
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // 存储当前选中记录数据的状态变量
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      {
        "title": "levelConstructor.name",
        "subTitle": "姓名",
        "dataIndex": "name",
        "width": 160,
        "align": "center",
        render(text: any, record: any) {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record);
                setIsOpen(true);
              }}
              style={{ color: '#1890ff', cursor: 'pointer' }}
            >
              {text}
            </a>
          );
        }
      },
      'employee_number', // '员工编号',
      'id_card', // '证件号',
      'province_name', // '省份id',
      'city_name', // '市id',
      'company', // '注册企业',
      'major', // '注册专业',
      'register_date_start_str', // '注册有效期开始',
      'register_date_end_str', // '注册有效期结束',
      'registration_number', // '注册编号',
      'use_date_start_str', // '使用有效期（起始）',
      'use_date_end_str', // '使用有效期（截止）',
      {
        title: "contract.file_url",
        subTitle: "附件",
        dataIndex: "url",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >{formatMessage({ id: 'wrokLicenseRegister.download' })}</Button>
            )
          }
          return '/'
        }
      },
      'remark', // '备注',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name'
    ])
    
      .needToExport([
        'name', // '姓名',
        'employee_number', // '员工编号',
        'id_card', // '证件号',
        'province_id', // '省份id',
        'city_id', // '市id',
        'company', // '注册企业',
        'major', // '注册专业',
        'register_date_start', // '注册有效期开始',
        'register_date_end', // '注册有效期结束',
        'registration_number', // '注册编号',
        'use_date_start', // '使用有效期（起始）',
        'use_date_end', // '使用有效期（截止）',
        'remark', // '备注',
        "create_ts_str",
        "create_user_name",
        "modify_ts_str",
        'modify_user_name'
      ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = (reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Space>
        <Button
          style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
          type="primary"
          onClick={() => {
            setAddVisible(true);
          }}
        >
          新增
        </Button>
        <Button
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={(e) => {
            if (actionRef.current) {
              actionRef.current.exportFile();
            }
          }}
        >导出</Button>
      </Space>

    ]
  }

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[], reloadTable: (filters?: [], noFilters?: []) => void) => {
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length === 0) {
            message.warn('请选择一条数据');
            return;
          }
          if (selectedRows.length !== 1) {
            message.warn('每次只能操作一条数据');
            return;
          }
          setSelectedRecord(selectedRows[0]);
          setEditVisible(true)
        }}
      >
        编辑
      </Button>,
      <Button
        danger
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => {
          if (selectedRows.length !== 1) {
            message.warning("每次只能删除一条数据");
            return;
          }
          Modal.confirm({
            title: "删除",
            content: "确定删除所选的内容？",
            okText: "确定删除",
            okType: "danger",
            cancelText: "我再想想",
            onOk() {
              dispatch({
                type: "workLicenseRegister/deleteAConstructionDivision",
                payload: {
                  id: selectedRows[0].id,
                },
                callback: (res: any) => {
                  if (res.errCode === ErrorCode.ErrOk) {
                    message.success("删除成功");
                    if (actionRef.current) {
                      actionRef.current.reloadTable();
                    }
                  }
                },
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }}
      >
        删除
      </Button>
    ]
  }
  return (
    <>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle={formatMessage({ id: 'levelConstructor' })}
        type="workLicenseRegister/getAConstructionDivision"
        exportType="workLicenseRegister/getAConstructionDivision"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getAConstructionDivision'}
        tableSortOrder={{ sort: 'modify_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        // tableDefaultFilter={getDefaultFiltersEngine()}
      />
      {addVisible && (
        <Add
          visible={addVisible}
          onCancel={() => setAddVisible(false)}
          callbackSuccess={() => {
            setAddVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {editVisible && (
        <Edit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {isOpen && (
        <Detail
          visible={isOpen}
          selectedRecord={selectedRecord}
          authority={authority}
          onCancel={() => setIsOpen(false)}
          callbackSuccess={() => {
            setIsOpen(false);
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </>
  )
}
export default connect()(LevelConstructor);
