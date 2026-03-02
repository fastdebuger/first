import React, { useRef, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns, BaseImportModal } from 'yayang-ui';
import { configColumns } from './columns';
import ConfigPriceLevelAdd from './Add';
import ConfigPriceLevelEdit from './Edit';
import ConfigPriceLevelDetail from './Detail';
import { ErrorCode } from '@/common/const';
import { hasPermission } from '@/utils/authority';

/**
 * 等级配置
 * @constructor
 */
const BaseConfigPriceLevel: React.FC<any> = (props) => {
  const {
    dispatch,
    route: { authority },
  } = props;
  const actionRef: any = useRef();
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [delVisible, setDelVisible] = useState(false);
  const [delList, setDelList] = useState('');
  const [delName, setDelName] = useState('');

  const handleDel = () => {
    dispatch({
      type: 'income/deletePriceLevel',
      payload: {
        id: delList ? delList?.id : '',
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }
        setDelVisible(false);
      },
    });
  };

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        "min_price",
        "max_price",
        "project_level_str",
        "contract_mode_str",
        'owner_group_str'
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "max_price",
        "min_price",
        "project_level_str",
        "contract_mode_str",
        'owner_group_str'
      ]);
    return cols.getNeedColumns();
  };
  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [
      <Button
        key={authority + 'add'}
        style={{ display: hasPermission(authority, '新增') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => {
          setAddVisible(true);
        }}
      >
        新增
      </Button>,
      // <a
      //   key={authority + 'import'}
      //   style={{ display: hasPermission(authority, '导入') ? 'inline' : 'none' }}
      //   onClick={(e) => {
      //     e.stopPropagation();
      //     setVisible(true);
      //   }}
      // >
      //   导入
      // </a>,
      <a
        key={authority + 'export'}
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={() => {
          if (actionRef.current) {
            actionRef.current.exportFile();
          }
        }}
      >
        导出
      </a>,
    ];
  };
  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    return [
      <Button
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => {
          setSelectedRecord(selectedRows[0])
          setEditVisible(true);
        }}
      >
        编辑
      </Button>,
      <Button
        key={authority + 'betchdel'}
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        onClick={() => {
          setDelList(selectedRows[0]);
          setDelVisible(true);
          setDelName(selectedRows[0].owner_unit_name);
        }}
      >
        删除
      </Button>,
    ];
  };
  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="RowNumber"
        tableTitle="等级配置"
        funcCode={authority}
        type="income/getPriceLevel"
        importType="income/getPriceLevel"
        tableColumns={getTableColumns()}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        rowSelection={{ type: 'radio' }}
        tableDefaultFilter={
          []
        }
      />
      {open && selectedRecord && (
        <ConfigPriceLevelDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
        />
      )}
      {
        editVisible && (
          <ConfigPriceLevelEdit
            selectedRecord={selectedRecord}
            visible={editVisible}
            onCancel={() => setEditVisible(false)}
            callbackAddSuccess={() => {
              setEditVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {
        addVisible && (
          <ConfigPriceLevelAdd
            visible={addVisible}
            onCancel={() => setAddVisible(false)}
            callbackAddSuccess={() => {
              setAddVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadTable();
              }
            }}
          />
        )
      }
      {visible && (
        <BaseImportModal
          maxCount={1}
          visible={visible}
          onCancel={() => setVisible(false)}
          startUploadFile={(file: any) => {
            if (actionRef.current) {
              return actionRef.current.importFile(file, authority, () => {
                setVisible(false);
              });
            }
          }}
          downLoadTemplate={() => {
            if (actionRef.current) {
              actionRef.current.downloadImportFile(authority);
            }
          }}
        />
      )}
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={'primary'} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>确认要删除吗?</p>
      </Modal>
    </div>
  );
};
export default connect()(BaseConfigPriceLevel);
