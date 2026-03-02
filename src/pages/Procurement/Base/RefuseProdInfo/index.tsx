import React, { useRef, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { connect, useIntl } from 'umi';
import { ErrorCode } from '@/common/const'; // CONST
import { hasPermission, } from '@/utils/authority';
import { configColumns } from './columns';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import AddModal from './component/add'

import { BasicTableColumns } from "yayang-ui";

const { confirm } = Modal;
import { DownloadOutlined } from "@ant-design/icons";

/**
 * @param props
 * @constructor
 */
const RefuseProdInfo: React.FC<any> = (props) => {
  const { formatMessage } = useIntl();
  const {
    route: { authority, name },
    dispatch,
  } = props;
  const childRef = useRef();
  const [addVisible, setAddVisible] = useState(false);

  /**
   * 解除物料限制
   * @param rows
   */
  const handleBatchDelete = (rows: any[]) => {
    //处理转义符
    rows.forEach((item: any) => {
      if (item.prod_code.indexOf('\\') > 0) {
        const reg2 = new RegExp(/\\/g);
        Object.assign(item, {
          prod_code: item.prod_code.replace(reg2, "\\\\")
        })
      }
    })
    confirm({
      title: `确定要解除以下物料编码的限制嘛 : ${rows.map(r => r.prod_code).join("、")}?`,
      okText: formatMessage({ id: 'common.delete' }),
      cancelText: formatMessage({ id: 'common.cancel' }),
      onOk() {
        dispatch({
          type: 'matreialprodinfo/batchDelRefuseOutStorageLst',
          payload: {
            delId: `'${rows.map(r => r.prod_code).join("','")}'`
          },
          callback: (res: any) => {
            if (res.errCode === ErrorCode.ErrOk) {
              message.success(formatMessage({ id: 'common.list.del.success' }));
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
   * 获取表格配置
   */
  const getTableColumns = () => {
    const fixedCol = new BasicTableColumns(configColumns);
    return fixedCol
      .initTableColumns([
        'comp_type_str',
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
      ]).needToExport([
        'comp_type_str',
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
        type='primary'
        size='middle'
        onClick={() => {
          setAddVisible(true)
        }}
      >
        批量新增
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
      style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
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
  ]

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
            message.success(formatMessage({ id: 'common.list.add.success' }));
          }
          if (childRef.current) {
            // @ts-ignore
            childRef.current.reloadTable();
          }
        },
      });
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <BaseCurdSingleTable
        cRef={childRef}
        moduleCaption={name}
        rowKey="prod_code"
        funcCode={authority + "queryRefuseOutStorageLs"}
        height={'calc(100vh - 340px)'}
        tableTitle="不允许发放物料"
        type='matreialprodinfo/queryRefuseOutStorageLst'
        exportType='matreialprodinfo/queryRefuseOutStorageLst'
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'upload_ts', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
      />
      {addVisible && <AddModal
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
        handleBatchAdd={handleBatchAdd}
      />}
    </div>
  );
};

export default connect()(RefuseProdInfo);
