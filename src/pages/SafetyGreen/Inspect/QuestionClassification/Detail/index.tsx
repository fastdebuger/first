import React, {useRef, useState} from "react";
import {Button, message, Modal, Space} from "antd";
import {configColumns} from "../columns";
import {BasicTableColumns, HeaderAndBodyTable} from "yayang-ui";
import QualitySafetyFactorTypeEdit from "../Edit";
import {connect, useIntl} from "umi";
import {ErrorCode} from "@/common/const";
import {hasPermission} from "@/utils/authority";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";

const {CrudQueryDetailDrawer} = HeaderAndBodyTable;

/**
 * 问题归类配置详情
 * @param props
 * @returns
 */
const QualitySafetyFactorTypeDetail: React.FC<any> = (props: any) => {
  const {authority, open, onClose, selectedRecord, actionRef, dispatch} = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const {formatMessage} = useIntl();
  const childRef: any = useRef();

  const getTableColumns = () => {
    const cols: any = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'problem_type_str',
      'problem_name',
    ])
    cols.needColumns.forEach((item: any) => {
      Object.assign(item, {subTitle: formatMessage({id: item.title})})
    });
    return cols.getNeedColumns();
  };

  const getBodyTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'problem_b_name',
      'weight_num'
    ])
    .needToExport([
      "problem_b_name",
      'weight_num'
    ])
    return cols.getNeedColumns();
  };

  const renderButtonToolbar = () => {
    return [
      <Button
        style={{display: hasPermission(authority, '编辑') ? 'inline' : 'none'}}
        type={"primary"}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      <Button
        style={{display: hasPermission(authority, '删除') ? 'inline' : 'none'}}
        danger
        type={"primary"}
        onClick={() => setDelVisible(true)}
      >
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "qualitySafetyFactorType/delQualitySafetyFactorType",
      payload: {
        form_no: selectedRows[0]['form_no'],
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };

  /**
   * 功能按钮组
   */
  const renderBodyButtonToolbar = () => {
    return [
      <Button
        style={{display: hasPermission(authority, '导出') ? 'inline' : 'none'}}
        type="primary"
        onClick={() => childRef.current.exportFile()}
      >
        {formatMessage({id: 'common.list.export'})}
      </Button>,
    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="problem_name"
        title="问题归类配置"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <BaseCurdSingleTable
          cRef={childRef}
          rowKey="id"
          tableTitle="问题归类配置详情"
          type="qualitySafetyFactorType/queryQualitySafetyFactorTypeBody"
          exportType="qualitySafetyFactorType/queryQualitySafetyFactorTypeBody"
          tableDefaultFilter={[
            {Key: 'form_no', Val: selectedRecord.form_no, Operator: '='},
          ]}
          tableColumns={getBodyTableColumns()}
          tableSortOrder={{ sort: 'id', order: 'desc' }}
          buttonToolbar={renderBodyButtonToolbar}
          selectedRowsToolbar={() => []}
          defaultPageSize={undefined}
          rowSelection={null}
          scroll={{y: "calc(100vh - 320px)"}}
          height={"calc(-115px + 100vh)"}
          funcCode={authority + "-detail"}
        />
      </CrudQueryDetailDrawer>
      {editVisible && (
        <QualitySafetyFactorTypeEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        delVisible && (
          <Modal
            title="删除数据"
            footer={
              <Space>
                <Button onClick={() => setDelVisible(false)}>我再想想</Button>
                <Button type={"primary"} danger onClick={() => handleDel()}>
                  确认删除
                </Button>
              </Space>
            }
            open={delVisible}
            onOk={handleDel}
            onCancel={() => setDelVisible(false)}
          >
            <p>是否删除当前的数据: {selectedRecord[""]}</p>
          </Modal>
        )
      }
    </>
  )
}

export default connect()(QualitySafetyFactorTypeDetail);
